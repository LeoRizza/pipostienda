import { productModel } from "../models/products.models.js";

export const getProducts = async (req, res) => {
    const { limit, page, sort, category } = req.query
    
    const pag = page ? parseInt(page, 10) : 1;
    const lim = limit ? parseInt(limit, 10) : 10;
    const ord = sort === 'asc' ? 1 : -1;

    try {
        let query = {};
        if (category) {
            query.category = category;
        }

        const prods = await productModel.paginate(query, { limit: lim, page: pag, sort: { price: ord }});

        if (prods) {
            return res.status(200).send({
                totalDocs: prods.totalDocs,
                totalPages: prods.totalPages,
                page: prods.page,
                products: prods.docs
            });
        }
        res.status(404).send({ error: "productos no encontrados"});

    } catch (error) {
        res.status(500).send({ error: `Error en consultar productos ${error}`});
    }
};

export const getProductById = async (req, res) => {
    const { id } = req.params;

    try {
        const prod = await productModel.findById(id);

        if (prod) {
            return res.status(200).send(prod);
        }

        res.status(404).send({ error: "Producto no encontrado" });

    } catch (error) {
        res.status(500).send({ error: `Error en consultar producto ${error}` });
    }
};


export const postProduct = async (req, res) => {
    const { title, description, code, price, stock, category, thumbnails } = req.body

    try {
        const prod = await productModel.create({ title, description, code, price, stock, category, thumbnails })

        if (prod) {
            return res.status(201).send(prod)
        }

        res.status(400).send({ error: `Error en crear producto` })

    } catch (error) {
        if (error.code == 11000) {
            return res.status(400).send({ error: "Producto ya creado" })
        }
        res.status(500).send({ error: `Error en crear producto ${error}` })
    }
}

export const putProductById = async (req, res) => {
    const { id } = req.params;
    const { title, description, code, price, stock, category, thumbnails } = req.body;
    
    try {
        const prod = await productModel.findByIdAndUpdate(
            id,
            { title, description, code, price, stock, category, thumbnails },
            { new: true }
        );

        if (prod) {
            return res.status(200).send(prod);
        }

        res.status(404).send({ error: "Producto no encontrado" });

    } catch (error) {
        res.status(500).send({ error: `Error en actualizar producto ${error}` });
    }
}


export const deleteProductById = async (req, res) => {
    const { id } = req.params

    try {
        const prod = await productModel.findByIdAndDelete(id)

        if (prod) {
            return res.status(200).send({ message: 'Producto eliminado con éxito' });
        }

        res.status(404).send({ error: "Producto no encontrado" })

    } catch (error) {
        res.status(500).send({ error: `Error en eliminar producto ${error}` })
    }
}