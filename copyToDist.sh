cp circuits/withdraw_bunnyNote/withdraw_0001.zkey dist/withdraw_0001.zkey

cp circuits/withdraw_bunnyNote/withdraw_js/withdraw.wasm dist/withdraw.wasm

cp abis/BunnyNotes.json dist/BunnyNotes.json
cp abis/MOCKERC20.json dist/MOCKERC20.json
cp abis/ERC20.json dist/ERC20.json
cp abis/WithdrawVerifier.json dist/WithdrawVerifier.json
cp abis/TokenSale.json dist/TokenSale.json
rm -rf dist/imgs

cp -R imgs dist/imgs
