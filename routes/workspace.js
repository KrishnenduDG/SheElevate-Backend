import express from "express";

const router = express.Router();

router.post("/add", (req, res) => {});
export default router;
function handleAdd(req, res) {
    res.send('Response from /add route');
}

function handleDelete(req, res) {
    res.send('Response from /delete route');
}

function handleCategory(req, res) {
    res.send('Response from /?category route');
}


app.get('/add', handleAdd);
app.get('/delete', handleDelete);
app.get('/?category', handleCategory);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
