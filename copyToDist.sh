cp circuits/withdraw_bunnyNote/withdraw_0001.zkey dist/withdraw_0001.zkey

cp circuits/withdraw_bunnyNote/withdraw_js/withdraw.wasm dist/withdraw.wasm

cp circuits/wallet_owner/isOwner_0001.zkey dist/isOwner_0001.zkey
cp circuits/wallet_owner/isOwner_js/isOwner.wasm dist/isOwner.wasm

cp abis/ERC20Notes.json dist/ERC20Notes.json
cp abis/ETHNotes.json dist/ETHNotes.json
cp abis/BunnyWallet.json dist/BunnyWallet.json
cp abis/MOCKERC20.json dist/MOCKERC20.json
cp abis/MOCKERC721.json dist/MOCKERC721.json

rm -rf dist/imgs

cp -R imgs dist/imgs
