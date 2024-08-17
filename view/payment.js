const nameDOM = document.getElementById('name');
const descriptionDOM = document.getElementById('description');
const amountDOM = document.getElementById('amount');
const quantityDOM = document.getElementById('quantity');
const formDom = document.getElementById('form')

formDom.addEventListener('submit', async (e) => {
    e.preventDefault()
    const name = nameDOM.value;
    const description = descriptionDOM.value;
    const amount = amountDOM.value;
    const quantity = quantityDOM.value;
    console.log(name, description, amount, quantity);
    try {
        const response = await axios.post('/api/v1/orders/payment', {name, description, amount, quantity});
        console.log(JSON.stringify({success: response.data.session.url}));

        window.location.href = response.data.session.url

    }catch(error) {
        console.log(error)
    }
});