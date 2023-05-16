import { hashLeaves } from "./generateCommitmentHash";
enum HashDirection {
    LEFT = 0,
    RIGHT = 1

}

type MerkleProof = Array<{ hash: bigint, direction: HashDirection }>

export function generateMerkleRoot(leaves: Array<bigint>, tree: { layers: Array<Array<bigint>> }): Array<bigint> {
    if (leaves.length === 0) {
        return [];
    }

    const combinedHashes: bigint[] = [];
    for (let i = 0; i < leaves.length; i += 2) {
        // I need to duplicate the last leaf if the tree is uneven
        if (leaves[i + 1]) {
            combinedHashes.push(hashLeaves(leaves[i], leaves[i + 1]))
        } else {
            combinedHashes.push(hashLeaves(leaves[i], leaves[i]))
        }
    }
    tree.layers.push(combinedHashes);
    // if the combined hashes length is 1 then we have the merkle root

    if (combinedHashes.length === 1) {
        return combinedHashes;
    }
    return generateMerkleRoot(combinedHashes, tree);
}

// function padTree(tree: { layers: bigint[][] }) {
//     for (let i = tree.layers.length - 1; i < TREELEVELS - 1; i++) {
//         const lastRoot = tree.layers[i][0];
//         tree.layers[i].push(lastRoot);
//         const newRoot = hashLeaves(lastRoot, lastRoot);
//         tree.layers.push([newRoot]);
//     }

//     return tree.layers[tree.layers.length - 1];
// }

export function generateMerkleTree(leaves: Array<bigint>) {
    const tree = { layers: [leaves] }
    const merkleRoot = generateMerkleRoot(leaves, tree);

    return {
        root: merkleRoot[0],
        // padded[0], 
        tree
    }
}

// CombineHashes will sort the leaf pairs into a mapping 
//and stores the product of the hash as a the key of the mapping
const combineHashes = (leavesToCombine: Array<bigint>, leafIndex: number) => {
    const combinedHashes: bigint[] = [];
    let pair = {};
    let key = BigInt("0");
    // let proofPath;

    for (let i = 0; i < leavesToCombine.length; i += 2) {
        // I need to duplicate the last leaf if the tree is uneven
        let hash = BigInt(0);

        let preimage;
        if (leavesToCombine[i + 1]) {
            preimage = [leavesToCombine[i], leavesToCombine[i + 1]];
            hash = hashLeaves(leavesToCombine[i], leavesToCombine[i + 1])
        } else {
            // if leavesToCombine[i+1] is undefined that means the last leaf needs to be duplicated
            preimage = [leavesToCombine[i], leavesToCombine[i]];
            hash = hashLeaves(leavesToCombine[i], leavesToCombine[i])
        }

        if (i === leafIndex) {
            pair = preimage;
            key = hash;
        } else if (i + 1 === leafIndex) {
            pair = preimage
            key = hash;
        }
        combinedHashes.push(hash);

    }
    return { pair, key };
}

const getLeafPairs = (tree: any, leaf: any) => {
    let leafToCheck = leaf; // The first leaf I need to find is the one I need proof for
    let leafIndex = 0; // Initialize the leafIndex so it's not undefined at any time
    let pairedLeaves = new Map(); // sort the paired leaves into a map
    let keys: string[] = []; // collect the keys of the map so we can iterate on it

    // Here I'm sorting out the paired leaves created with combineHashes
    for (let i = 0; i < tree.layers.length - 1; i++) {
        // I need to find here the index of the leaf I'm looking for
        leafIndex = tree.layers[i].findIndex((l: any) => l === leafToCheck);
        // I need to get the current layer I'm checking
        const leafLayer = tree.layers[i];
        // Find the pair in the layer that produces the required hash
        const { pair, key } = combineHashes(leafLayer, leafIndex);
        // save the pair with the key
        pairedLeaves.set(key.toString(), pair);
        // save the key for later iteration
        keys.push(key.toString());
        // add the key as the next leaf to check in the next layer
        leafToCheck = key as bigint;
    }
    return { pairedLeaves, keys }
}

const convertToProofFormat = (keys: any, pairedLeaves: any) => {
    let proof: { hash: bigint, direction: HashDirection }[] = [];
    // A quick iteration over the keys to sort out the mapping
    // This converts the paired leaves to a data structure more suited for using as a proof
    for (let i = 0; i < keys.length; i++) {
        //I loop over the keys 
        const key = keys[i].toString();
        // Get the pairs from the map
        const pair = pairedLeaves.get(key);
        if (i === 0) {
            // the first will have hard coded directions!
            proof.push({ hash: pair[0], direction: HashDirection.LEFT })

            proof.push({ hash: pair[1], direction: HashDirection.RIGHT })
        } else {
            // Use the previous key, which was a hash to figure out the direction
            // This is needed because the previous key is always the product of hashing
            // and not actually needed to be stored in the proof!
            // I just need to know if it's gonna be on the left or right!
            const prevKey = keys[i - 1].toString();
            const prevKeyAsBigint = BigInt(prevKey);
            if (prevKeyAsBigint === pair[0]) {
                proof.push({ hash: pair[1], direction: HashDirection.RIGHT })
            } else {
                proof.push({ hash: pair[0], direction: HashDirection.LEFT })
            }
        }
    }
    return proof;
}

export function generateMerkleProof(leaf: bigint, leaves: Array<bigint>): any {
    if (!leaf || leaves.length === 0) {
        return [];
    }
    // I recreate a merkle tree from the leaves
    const { tree } = generateMerkleTree(leaves);

    const { keys, pairedLeaves } = getLeafPairs(tree, leaf);

    return convertToProofFormat(keys, pairedLeaves);
}

// Reduce the merkle proof to a root by hashing the leaves and determining direction!
export function getMerkleRootFromMerkleProof(merkleProof: MerkleProof) {
    const merkleRootFromProof = merkleProof.reduce(
        //@ts-ignore
        (leafProof1, leafProof2) => {
            if (leafProof2.direction === HashDirection.RIGHT) {
                const hash = hashLeaves(leafProof1.hash, leafProof2.hash);
                return { hash }
            }
            const hash = hashLeaves(leafProof2.hash, leafProof1.hash);
            return { hash }
        });
    return merkleRootFromProof.hash;
}


export type EncodedForCircuit = {
    pathElements: Array<bigint>,
    pathIndices: Array<HashDirection>,
}

export function encodeForCircuit(merkleProof: MerkleProof): EncodedForCircuit {
    let pathElements = [];
    let pathIndices = [];
    for (let i = 0; i < merkleProof.length; i++) {
        let path = merkleProof[i];
        pathElements.push(path.hash);
        pathIndices.push(path.direction);

    }

    return { pathElements, pathIndices }
}