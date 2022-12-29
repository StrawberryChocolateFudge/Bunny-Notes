// Set the network  into the session storage

export function setCurrentNToSS(id: string) {
    sessionStorage.setItem("networkid", id)
}

export function getCurrenttNetworkFromSS() {
    return sessionStorage.getItem("networkid");
}

// Get the network from session storage

export function setSelectedNToSS(networkSelected) {
    sessionStorage.setItem("networkSelected", networkSelected)
}

export function getSelectedNFromSS() {
    return sessionStorage.getItem("networkSelected");
}
