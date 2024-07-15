const notFound = (req, res) => res.status(404).json('route does not exist');

export default notFound;
