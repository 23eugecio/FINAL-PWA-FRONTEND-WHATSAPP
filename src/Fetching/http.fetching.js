export const POST = async (URL_BACK, params) => { 
    try { 
        const response = await fetch(URL_BACK, {
            method: 'POST', 
			...params
        });
        return response.json();
    } 
    catch(error){ 
		console.log(error)
		throw error
    } 
}


export const GET = async (URL_BACK, params) => {
	try{
		const response = await fetch(URL_BACK, {
			method: 'GET',
			...params
		})
		return response.json()
	}
	catch(error){
		console.log(error)
		throw error
		
	}
	
}



export const PUT = async (URL_BACK, params) => {
	try{
		const response = await fetch(URL_BACK, {
			method: 'PUT',
			...params
		})
        if(!response.ok){
            const errorBody = await response.json();
            throw new Error(errorBody.payload?.detail || 'Request failed');
        }
		return response.json()
	}
	catch(error){
		console.log(error)
		throw error
		
	}
	
}

export const DELETE = async (URL_BACK, params) => {
	try{
		const response = await fetch(URL_BACK, {
			method: 'DELETE',
			...params
		})
		return response.json()
	}
	catch(error){
		console.log(error)
		throw error
		
	}
	
}


const getUnnauthenticatedHeaders = () => {
    const unnauthenticatedHeaders = new Headers()
    unnauthenticatedHeaders.set('Content-Type', 'application/json')
    unnauthenticatedHeaders.set('x-api-key', '2cec07f3-b63f-4694-a841-5b66a8d5ba53')
    return unnauthenticatedHeaders
}

const getAuthenticatedHeaders = () => {
    const authenticatedHeaders = new Headers()
    authenticatedHeaders.set('Content-Type', 'application/json')
    authenticatedHeaders.set('x-api-key', '2cec07f3-b63f-4694-a841-5b66a8d5ba53')
    authenticatedHeaders.set('Authorization', 'Bearer ' + sessionStorage.getItem('access_token'))
    return authenticatedHeaders
}



export { getAuthenticatedHeaders, getUnnauthenticatedHeaders }