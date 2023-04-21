function fnMod(fn, before, after) {
  const myBefore = (before ? before : []);
  const myAfter = (after ? after : []);
  try {
    function hookable(...args) {
      myBefore.forEach(fn => fn.apply(this, args));
      const result = fn.apply(this, args);
      myAfter.forEach(fn => fn.apply(this, args));
      return result;
    };
  
    hookable.prependAction = (fn) => {
      myBefore.unshift(fn);
    }
  
    hookable.appendAction = (fn) => {
      myAfter.push(fn);
    }
  } catch (error) {
    log(error);
    throw(error);
  }

  return hookable;
}