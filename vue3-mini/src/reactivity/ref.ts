import { isTracking, trackEffects, triggerEffects } from './effect';
import { reactive } from './reactive';

class RefImpl {
  public _value
  public dep
  public _rawValue
  public __v_isRef = true
  constructor(value) {
    this._value = isDeepObject(value);
    this._rawValue = isDeepObject(value)
    this.dep = new Set()
  }
  get value() {
    trackRefValue(this)
    return this._value;
  }
  set value(newVal) {
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = isDeepObject(newVal)
      this._value = isDeepObject(newVal);
      triggerEffects(this.dep)
    }
  }
}


export function ref(value) {
  return new RefImpl(value);
}
export function isRef(value) {
  return !!value.__v_isRef
}
export function proxyRefs(objectWithRefs){
  return new Proxy(objectWithRefs,{
    get(target, p) {
      return  unRef(Reflect.get(target, p))
    },
    // 如果 set 的值是非响应式，就是替换；如果是响应式，就是重新赋值
    set(target, p, value) {
        if(!isRef(value)&&isRef(target[p])){
          return (target[p].value=value)
        }else{
          return Reflect.set(target,p,value)
        }
    },
  })
}
export function unRef(ref) {
  return isRef(ref) ? ref.value : ref
}
function isDeepObject(ref) {
  return typeof ref === 'object' ? reactive(ref) : ref
}

function trackRefValue(ref) {
  if (isTracking()) {
    trackEffects(ref.dep)
  }
}

function hasChanged(newVal, oldVal) {
  return !Object.is(newVal, oldVal)
}
