let activeEffect
let shouldTrack = false
class ReactiveEffect {
  public _fn: any
  deps = []
  stopActive = true
  constructor(fn, scheduler?) {
    this._fn = fn
  }
  run() {
    if (!this.stopActive) {
      return this._fn()
    }
    shouldTrack = true
    activeEffect = this
    const result = this._fn()
    //重置
    shouldTrack = false
    return result
  }
  stop() {
    if (this.stopActive) {
      this.deps.forEach((dep: any) => {
        dep.delete(this)
      })
      this.stopActive = false
    }
  }
}

export function effect(fn, options = {}) {
  const _effect = new ReactiveEffect(fn)
  Object.assign(_effect, options)
  _effect.run()
  const runner: any = _effect.run.bind(_effect)
  runner.effect = _effect
  return runner
}
export function stop(fn) {
  fn.effect.stop()
}
export function isTracking() {
  return shouldTrack && activeEffect !== undefined
}
const targetMap = new Map()
export function track(target, key) {
  if (!isTracking()) return
  let depMaps = targetMap.get(target)
  if (!depMaps) {
    depMaps = new Map()
    targetMap.set(target, depMaps)
  }
  let dep = depMaps.get(key)
  if (!dep) {
    dep = new Set()
    depMaps.set(key, dep)
  }
  trackEffects(dep)
}
export function trackEffects(dep){
  if (!dep.has(activeEffect)) {
    dep.add(activeEffect)
    activeEffect.deps.push(dep)
  }
}
export function trigger(target, key) {
  let depMaps = targetMap.get(target)
  let deps = depMaps.get(key)
  triggerEffects(deps)
}
export function triggerEffects(deps){
  for (const dep of deps) {
    if (dep.scheduler) {
      dep.scheduler()
    } else {
      dep.run()
    }
  }
}
