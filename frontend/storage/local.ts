// Store the terms acceptance in Local storage!

export function setTermsAcceptedToLS(accepted: string) { 
    localStorage.setItem("termsAccepted",accepted);
}

export function getTermsAcceptedFromLS(){
    return localStorage.getItem("termsAccepted");
}