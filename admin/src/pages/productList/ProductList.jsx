import React, { useEffect, useState} from 'react'
import "./productList.css";
import { DataGrid} from '@mui/x-data-grid';
import { DeleteOutline } from '@mui/icons-material';
import { Link } from 'react-router-dom';
import { deleteProduct, getProducts } from '../../redux/apiCalls';
import { useDispatch, useSelector } from 'react-redux';

export default function ProductList() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    const products = useSelector(state=>state.product.products);

    useEffect(()=>{
        const fetchProducts = async () => {
            setLoading(true);
            await getProducts(dispatch);
            setLoading(false);
        };
        fetchProducts();
    },[dispatch]);

    const addProductButton = {
        marginBottom: "20px",
        padding: "10px 20px",
        backgroundColor: "#2ecc71",
        color: "white",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        fontSize: "16px",
        fontWeight: "500",
        transition: "background-color 0.3s"
    };
  

    const [message, setMessage] = useState(null);

    const handleDelete = async (id) => {
        if (window.confirm("Are you sure you want to delete this product?")) {
            setLoading(true);
            try {
                const result = await deleteProduct(id, dispatch);
                setMessage({ type: "success", text: result.message });
                setTimeout(() => setMessage(null), 3000);
            } catch (err) {
                setMessage({ type: "error", text: err.response?.data?.message || "Error deleting product" });
                setTimeout(() => setMessage(null), 3000);
            } finally {
                setLoading(false);
            }
        }
    };
    const columns = [
        { field: '_id', headerName: 'Product ID', width: 220 },
        { field: 'product', headerName: 'Product Name', width: 200,
        renderCell:(params)=>{
            return (
                <div className="productListItem">
                    <img src={params.row.img} alt="" className='productListImg' />
                    {params.row.title}
                </div>
            )
        } },
        { field: 'inStock', headerName: 'Stock Available', width: 120 },
       
        { field: 'price', headerName:  'Price', width: 120 },
        {
            field:"action",
            headerName:"Action",width:150,
            renderCell: (params)=> {
                return(<>
                <Link to={{ pathname:"/product/"+params.row._id, product: params.row}}>
                    <button className="productListEdit">Edit</button>
                </Link>
                    <DeleteOutline className="productListDelete"
                     onClick={()=>handleDelete(
                        params.row._id
                    )}/>
                </>
                );
            }
        },
      ];
  return (
    <div className='productList'>
        <div style={{ padding: "20px" }}>
            <Link to="/newproduct" style={{ textDecoration: 'none' }}>
                <button style={addProductButton}>
                    Add New Product
                </button>
            </Link>
            {message && (
                <div
                    style={{
                        marginTop: "10px",
                        padding: "10px",
                        backgroundColor: message.type === "success" ? "#d4edda" : "#f8d7da",
                        color: message.type === "success" ? "#155724" : "#721c24",
                        borderRadius: "4px",
                        textAlign: "center"
                    }}
                >
                    {message.text}
                </div>
            )}
        </div>
        <DataGrid
            rows={products}
            loading={loading}
            disableRowSelectionOnClick
            columns={columns}
            pageSize={5}
            rowsPerPageOptions={[5]}
            checkboxSelection
            getRowId={(row)=> row._id}
            autoHeight
        />
    </div>
  )
}
