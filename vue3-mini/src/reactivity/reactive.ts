import { track, trigger } from './effect'

const enum ReactiveFlags {
  IS_REACTIVE = '__v_isReactive',
  IS_READONLY = '__v_isReadOnly'
}
export function reactive(obj) {
  return createReactiveObj(obj, reactiveHandler)
}
export function readonly(obj) {
  return createReactiveObj(obj, readonlyHandler)
}
export function shallowReadonly(obj) {
  return createReactiveObj(obj, shallowReadonlyHandler)
}
export function isReactive(obj) {
  return !!obj[ReactiveFlags.IS_REACTIVE]
}
export function isReadonly(obj) {
  return !!obj[ReactiveFlags.IS_READONLY]
}
export function isProxy(obj) {
  return isReactive(obj) || isReadonly(obj)
}

function createReactiveObj(obj, baseHandler) {
  if (!(typeof obj === 'object')) {
    console.warn(`target ${obj} is not a object`)
  }
  const proxy = new Proxy(obj, baseHandler)
  return proxy
}
const get = createGetter()
const set = createSetter()
const readonlyGet = createGetter(true)
const shallowReadonlyGet = createGetter(true, true)
function createGetter(isReadonly = false, isShallow = false) {
  return function get(target, key) {
    if (key === ReactiveFlags.IS_REACTIVE) {
      return !isReadonly
    } else if (key === ReactiveFlags.IS_READONLY) {
      return isReadonly
    }
    const res = Reflect.get(target, key)
    if (isShallow) {
      return res
    }
    if (typeof res === 'object') {
      return isReadonly ? readonly(res) : reactive(res)
    }

    if (!isReadonly) {
      track(target, key)
    }
    return res
  }
}
function createSetter() {
  return function set(target, key, value) {
    const result = Reflect.set(target, key, value)
    trigger(target, key)
    return result
  }
}
const reactiveHandler = {
  get,
  set
}
const readonlyHandler = {
  get: readonlyGet,
  set(target, key, value) {
    console.warn(`key:${target} set 失败, 因为target是readonly类型的`);
    return true
  }
}

const shallowReadonlyHandler = Object.assign({}, readonlyHandler, {
  get: shallowReadonlyGet
})
