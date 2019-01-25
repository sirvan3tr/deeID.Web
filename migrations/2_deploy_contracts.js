var deeID = artifacts.require("./deeID");
var deeIDPortal = artifacts.require("./deeIDPortal");
var deeIDRegistry = artifacts.require("./deeIDRegistry");

module.exports = function(deployer) {
  deployer.deploy(deeIDPortal);
  deployer.deploy(deeIDRegistry);
  deployer.deploy(deeID , '0xc5fdf4076b8f3a5357c5e395ab970b5b54098fef');
};