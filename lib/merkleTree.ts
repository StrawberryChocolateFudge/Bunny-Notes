import { hashLeaves } from "./generateCommitmentHash";
enum HashDirection {
    LEFT = 0,
    RIGHT = 1

}

const TREELEVELS = 20;

export type MerkleProof = Array<{ hash: bigint, direction: HashDirection }>
function ensureEven(leaves: Array<bigint>) {
    if (leaves.length % 2 !== 0) {
        leaves.push(leaves[leaves.length - 1]);
    }
}
export function generateMerkleRoot(leaves: Array<bigint>, tree: { layers: Array<Array<bigint>> }): Array<bigint> {
    if (leaves.length === 0) {
        return [];
    }
    ensureEven(leaves);
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

function padTree(tree: { layers: bigint[][] }) {
    for (let i = tree.layers.length - 1; i < TREELEVELS - 1; i++) {
        const lastRoot = tree.layers[i][0];
        tree.layers[i].push(lastRoot);
        const newRoot = hashLeaves(lastRoot, lastRoot);
        tree.layers.push([newRoot]);
    }

    return {
        tree,
        root: tree.layers[tree.layers.length - 1][0]
    };
}

export function generateMerkleTree(leaves: Array<bigint>) {
    const tree = { layers: [leaves] }
    generateMerkleRoot(leaves, tree);
    // Padding the tree here so we can use it in circom with a hard coded 20 level tree
    return padTree(tree);
}


const getLeafNodeDirectionInMerkleTree = (leaf: bigint, merkleTree: bigint[][]) => {
    const hashIndex = merkleTree[0].findIndex(h => h === leaf);
    return hashIndex % 2 === 0 ? HashDirection.LEFT : HashDirection.RIGHT;
};

export function generateMerkleProof(leaf: bigint, leaves: Array<bigint>) {
    if (!leaf || !leaves || leaves.length === 0) {
        return null;
    }
    const { tree } = generateMerkleTree(leaves);
    const merkleProof = [{
        hash: leaf,
        direction: getLeafNodeDirectionInMerkleTree(leaf, tree.layers)
    }];
    let hashIndex = tree.layers[0].findIndex(h => h === leaf);
    for (let level = 0; level < tree.layers.length - 1; level++) {
        const isLeftChild = hashIndex % 2 === 0;
        const siblingDirection = isLeftChild ? HashDirection.RIGHT : HashDirection.LEFT;
        const siblingIndex = isLeftChild ? hashIndex + 1 : hashIndex - 1;
        const siblingNode = {
            hash: tree.layers[level][siblingIndex],
            direction: siblingDirection
        };
        merkleProof.push(siblingNode);
        hashIndex = Math.floor(hashIndex / 2);
    }
    return merkleProof;
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