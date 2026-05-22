export function flyToCart(sourceEl, imageUrl) {
  if (typeof window === 'undefined' || !sourceEl) return

  const cartTarget = document.getElementById('cart-fly-target')
  if (!cartTarget) return

  const sourceRect = sourceEl.getBoundingClientRect()
  const targetRect = cartTarget.getBoundingClientRect()

  const flyNode = document.createElement('div')
  flyNode.setAttribute('aria-hidden', 'true')
  flyNode.style.position = 'fixed'
  flyNode.style.left = `${sourceRect.left + sourceRect.width / 2 - 18}px`
  flyNode.style.top = `${sourceRect.top + sourceRect.height / 2 - 18}px`
  flyNode.style.width = '36px'
  flyNode.style.height = '36px'
  flyNode.style.borderRadius = '9999px'
  flyNode.style.pointerEvents = 'none'
  flyNode.style.zIndex = '9999'
  flyNode.style.border = '1px solid rgba(212,175,55,0.7)'
  flyNode.style.boxShadow = '0 0 22px rgba(212,175,55,0.55)'
  flyNode.style.background = imageUrl
    ? `center / cover no-repeat url("${imageUrl}")`
    : 'radial-gradient(circle at 30% 30%, #ffe7a6, #d4af37 60%, #7a5d12 100%)'

  document.body.appendChild(flyNode)

  const endX = targetRect.left + targetRect.width / 2 - (sourceRect.left + sourceRect.width / 2)
  const endY = targetRect.top + targetRect.height / 2 - (sourceRect.top + sourceRect.height / 2)
  const arcLift = Math.min(140, Math.max(50, Math.abs(endY) * 0.35))

  const animation = flyNode.animate(
    [
      { transform: 'translate(0, 0) scale(1)', opacity: 1, offset: 0 },
      { transform: `translate(${endX * 0.45}px, ${endY * 0.45 - arcLift}px) scale(0.85)`, opacity: 0.95, offset: 0.45 },
      { transform: `translate(${endX}px, ${endY}px) scale(0.28)`, opacity: 0.15, offset: 1 }
    ],
    {
      duration: 700,
      easing: 'cubic-bezier(0.2, 0.9, 0.2, 1)',
      fill: 'forwards'
    }
  )

  animation.onfinish = () => {
    flyNode.remove()
    cartTarget.animate(
      [
        { transform: 'scale(1)' },
        { transform: 'scale(1.18)' },
        { transform: 'scale(1)' }
      ],
      { duration: 240, easing: 'ease-out' }
    )
  }
}
