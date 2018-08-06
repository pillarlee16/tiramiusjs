const INTERNAL = function (){};

function Tiramius(executor) {
  this._fullfillHandler = undefined;
  if (typeof executor === 'function') {
    executor(this.resolve.bind(this));
  }
}

Tiramius.prototype.resolve = function (obj) {
  let result = null;
  if (this._fullfillHandler) {
    result = this._fullfillHandler(obj);
  }
  if (this._chain) {
    if (result instanceof Tiramius) {
      result._fullfillHandler = this._chain._fullfillHandler;
      return result;
    }

    this._chain.resolve(result);
  }

  return new Tiramius(INTERNAL);
}

Tiramius.prototype.then = function (didFullfill) {
  this._fullfillHandler = didFullfill;

  const tiramius = this._chain = new Tiramius(INTERNAL);
  return tiramius;
}


/****** Test Code ******/

function delay(time) {
  return new Tiramius((resolve) => {
    setTimeout(() => {
      console.log('timeout!!', time);
      resolve();
    }, time);
  })
}

console.log('start');

delay(1000)
  .then(() => { console.log('a'); return 'hahah'; })
  .then((data) => { console.log('b', data); return delay(3000); })
  .then(() => { console.log('c'); });
