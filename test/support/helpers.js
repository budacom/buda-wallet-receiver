exports.wait = function (_promiseFun) {
  return function(_done) {
    _promiseFun().then(_done, _done);
  };
};

exports.replaceBinaryMarker = function(_contract, _address) {
  if(_address.startsWith('0x')) _address = _address.slice(2);
  _contract.unlinked_binary = _contract.unlinked_binary.replace(
    /0123456789012345678901234567890123456789/gi, _address
  );
};

