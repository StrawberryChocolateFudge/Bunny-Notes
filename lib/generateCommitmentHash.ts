//@ts-ignore
import { poseidon } from "circomlibjs";
import { BigNumberish } from "./types";

enum HashDirection {
    LEFT = 0,
    RIGHT = 1

}

const LEFT = 0;
const RIGHT = 1;
const TREELEVELS = 20; // Hardcoded 20,  Circom does not support dynamic levels

export function generateCommitmentHash(nullifier: BigNumberish, secret: BigNumberish): bigint {
    return poseidon([BigInt(nullifier), BigInt(secret)]);
}

export function generateNullifierHash(nullifier: BigNumberish): bigint {
    return poseidon([BigInt(nullifier)])
}

export function generateNullifierWithSalt(nullifier: BigNumberish, salt: BigNumberish): bigint {
    return poseidon([BigInt(nullifier), BigInt(salt)]);
}

export function hashLeaves(leaf1: bigint, leaf2: bigint): bigint {
    return poseidon([leaf1, leaf2]);
}

export function generateMerkleRoot(leaves: Array<bigint>, tree: { layers: Array<Array<bigint>> }): Array<bigint> {
    if (leaves.length === 0) {
        return [];
    }

    const combinedHashes = [];
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

    return tree.layers[tree.layers.length - 1];
}

export function generateMerkleTree(leaves: Array<bigint>) {
    const tree = { layers: [leaves] }
    const merkleRoot = generateMerkleRoot(leaves, tree);
    console.log(tree.layers.length)
    const padded = padTree(tree);

    return { root: padded[0], tree }
}

function getLeafNodeDirectionInMerkleTree(leaf: bigint, merkleTree: bigint[][]): HashDirection {
    const hashIndex = merkleTree[0].findIndex(h => h === leaf);
    return hashIndex % 2 === 0 ? HashDirection.LEFT : HashDirection.RIGHT;
};

export type MerkleProof = Array<{ leaf: bigint, direction: HashDirection }>

export function generateMerkleProof(leaf: bigint, leaves: Array<bigint>): MerkleProof {
    if (!leaf || leaves.length === 0) {
        return [];
    }
    const { tree } = generateMerkleTree(leaves);
    const merkleProof = [{
        leaf,
        direction: getLeafNodeDirectionInMerkleTree(leaf, tree.layers)
    }]
    let leafIndex = tree.layers[0].findIndex(l => l === leaf);
    for (let level = 0; level < tree.layers.length - 1; level++) {
        const isLeftChild = leafIndex % 2 === 0;
        const siblingDirection = isLeftChild ? HashDirection.RIGHT : HashDirection.LEFT;
        const siblingIndex = isLeftChild ? leafIndex + 1 : leafIndex - 1;
        const siblingNode = {
            leaf: tree.layers[level][siblingIndex],
            direction: siblingDirection as HashDirection
        }
        merkleProof.push(siblingNode);
        leafIndex = Math.floor(leafIndex / 2);
    }
    return merkleProof;
}

export function getMerkleRootFromMerkleProof(merkleProof: MerkleProof) {
    const merkleRootFromProof = merkleProof.reduce(
        //@ts-ignore
        (leafProof1, leafProof2) => {
            if (leafProof2.direction === RIGHT) {
                const leaf = hashLeaves(leafProof1.leaf, leafProof2.leaf);
                return { leaf }
            }
            const leaf = hashLeaves(leafProof2.leaf, leafProof1.leaf);
            return { leaf }
        });
    return merkleRootFromProof.leaf;
}

export type EncodedForCircuit = {
    pathElements: Array<bigint>,
    pathIndices: Array<HashDirection>,
    commitmentIndex: number
}

export function encodeForCircuit(merkleProof: MerkleProof, commitmentToProve: bigint): EncodedForCircuit {
    let pathElements = [];
    let pathIndices = [];
    let commitmentIndex;
    for (let i = 0; i < merkleProof.length; i++) {
        let path = merkleProof[i];
        pathElements.push(path.leaf);
        pathIndices.push(path.direction);
        if (path.leaf === commitmentToProve) {
            commitmentIndex = i;
        }
    }
    if (commitmentIndex === undefined) {
        throw new Error("Commitment not found in tree");
    }
    return { pathElements, pathIndices, commitmentIndex }
}