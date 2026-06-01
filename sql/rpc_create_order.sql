-- RPC: create_order(payload jsonb)
-- Payload structure:
-- { form: { full_name, email, phone, address, landmark, delivery_date, delivery_time, notes, payment_method }, items: [ { id, name, qty, price }, ... ], total }

create or replace function create_order(payload jsonb) returns jsonb as $$
declare
  v_order_id int;
  v_order_number text;
  v_item jsonb;
  v_wine_id text;
  v_qty int;
  v_price numeric;
  v_stock int;
begin
  perform pg_advisory_xact_lock(1);

  insert into orders (customer_name, email, phone, address, landmark, delivery_date, delivery_time, notes, payment_method, status, total)
  values (
    payload->'form'->> 'full_name',
    payload->'form'->> 'email',
    payload->'form'->> 'phone',
    payload->'form'->> 'address',
    payload->'form'->> 'landmark',
    (payload->'form'->> 'delivery_date')::date,
    payload->'form'->> 'delivery_time',
    payload->'form'->> 'notes',
    payload->'form'->> 'payment_method',
    'Pending',
    (payload->> 'total')::numeric
  ) returning id, order_number into v_order_id, v_order_number;

  for v_item in select * from jsonb_array_elements(payload->'items') loop
    v_wine_id := (v_item->> 'id');
    v_qty := (v_item->> 'qty')::int;
    v_price := (v_item->> 'price')::numeric;

    if v_wine_id is not null and v_wine_id <> '' then
      select stock into v_stock from wines where id = v_wine_id for update;
      if v_stock is not null then
        if v_stock < v_qty then
          raise exception 'Insufficient stock for %', v_item->> 'name';
        end if;
        update wines set stock = stock - v_qty where id = v_wine_id;
        insert into inventory (wine_id, change, note) values (v_wine_id, -v_qty, 'Sale/order ' || v_order_id);
        insert into sales (wine_id, qty, revenue, day) values (v_wine_id, v_qty, v_price * v_qty, current_date);
      end if;
    end if;

    insert into order_items (order_id, wine_id, name, qty, price) values (v_order_id, v_wine_id, v_item->> 'name', v_qty, v_price);
  end loop;

  insert into payments (order_id, amount, method, status) values (v_order_id, (payload->> 'total')::numeric, payload->'form'->> 'payment_method', 'pending');

  return jsonb_build_object('ok', true, 'order_id', v_order_id, 'order_number', v_order_number);
exception when others then
  -- bubble up error
  raise;
end;
$$ language plpgsql security definer;
