#cp circuits/withdraw_0001.zkey dist/withdraw_0001.zkey

#cp circuits/withdraw_js/withdraw.wasm dist/withdraw.wasm

#cp Bunny.svg dist/Bunny.svg

# copy the TronWeb dependency to use in the browser
#cp node_modules/tronweb/dist/TronWeb.js dist/tronweb.js

cp artifacts/contracts/ERC20Notes.sol/ERC20Notes.json dist/ERC20Notes.json
cp artifacts/contracts/Mock/MockERC20.sol/MOCKERC20.json dist/MOCKERC20.json