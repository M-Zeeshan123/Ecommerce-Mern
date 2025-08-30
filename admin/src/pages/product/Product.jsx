import { Link, useLocation } from "react-router-dom";
import "./product.css";
import Chart from "../../components/chart/Chart";
import { useSelector } from "react-redux";
import { useEffect, useMemo, useState } from "react";
import { userRequest } from "../../requestMethods";
import { Publish } from "@mui/icons-material";

export default function Product() {
  const location = useLocation();
  const productId = location.pathname.split("/")[2];
  const [pStats, setPStats] = useState([]);

  const product = useSelector((state) =>
    state.product.products.find((product) => product._id === productId)
  );

  const MONTHS = useMemo(
    () => [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Agu",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ],
    []
  );

  useEffect(() => {
    const getStats = async () => {
      try {
        const res = await userRequest.get("orders/income?pid=" + productId);
        const list = res.data.sort((a,b)=>{
            return a._id - b._id
        })
        list.map((item) =>
          setPStats((prev) => [
            ...prev,
            { name: MONTHS[item._id - 1], Sales: item.total },
          ])
        );
      } catch (err) {
        console.log(err);
      }
    };
    getStats();
  }, [productId, MONTHS]);

  return (
    <div className="product">
      <div className="productTitleContainer">
        <h1 className="productTitle">Product</h1>
        <Link to="/newproduct">
          <button className="productAddButton">Create</button>
        </Link>
      </div>
      <div className="productTop">
        <div className="productTopLeft">
          <Chart data={pStats} dataKey="Sales" title="Sales Performance" />
        </div>
        <div className="productTopRight">
          <div className="productInfoTop">
            <img src={product.img} alt="" className="productInfoImg" />
            <span className="productName">{product.title}</span>
          </div>
          <div className="productInfoBottom">
            <div className="productInfoItem">
              <span className="productInfoKey">ID:</span>
              <span className="productInfoValue">{product._id}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Price:</span>
              <span className="productInfoValue">Rs. {product.price}</span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Stock Status:</span>
              <span className="productInfoValue" style={{ color: product.inStock ? 'green' : 'red' }}>
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Categories:</span>
              <span className="productInfoValue">
                {product.categories?.join(", ") || "N/A"}
              </span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Sizes:</span>
              <span className="productInfoValue">
                {Array.isArray(product.size) ? product.size.join(", ") : "N/A"}
              </span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Colors:</span>
              <span className="productInfoValue" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                {Array.isArray(product.color) ? (
                  <>
                    {product.color.join(", ")}
                    <div style={{ display: 'flex', gap: '4px' }}>
                      {product.color.map((color, index) => (
                        <div
                          key={index}
                          style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: color.toLowerCase(),
                            border: '1px solid #ddd',
                            borderRadius: '50%'
                          }}
                        />
                      ))}
                    </div>
                  </>
                ) : "N/A"}
              </span>
            </div>
            <div className="productInfoItem">
              <span className="productInfoKey">Description:</span>
              <span className="productInfoValue" style={{ whiteSpace: 'pre-wrap' }}>
                {product.desc || "No description available"}
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="productBottom">
        <form className="productForm">
          <div className="productFormLeft">
            <label>Product Name</label>
            <input type="text" defaultValue={product.title} name="title" />
            
            <label>Product Description</label>
            <textarea 
              rows="4" 
              name="desc" 
              defaultValue={product.desc}
              style={{ padding: '8px', marginBottom: '10px', resize: 'vertical' }}
            />
            
            <label>Price (Rs.)</label>
            <input type="number" defaultValue={product.price} name="price" />
            
            <label>Categories (comma separated)</label>
            <input 
              type="text" 
              defaultValue={product.categories?.join(", ")} 
              name="categories"
            />
            
            <label>Sizes (comma separated)</label>
            <input 
              type="text" 
              defaultValue={Array.isArray(product.size) ? product.size.join(", ") : ""}
              name="size"
            />
            
            <label>Colors (comma separated)</label>
            <input 
              type="text" 
              defaultValue={Array.isArray(product.color) ? product.color.join(", ") : ""}
              name="color"
            />
            
            <label>Stock Status</label>
            <select name="inStock" id="idStock" defaultValue={product.inStock}>
              <option value="true">In Stock</option>
              <option value="false">Out of Stock</option>
            </select>
          </div>
          <div className="productFormRight">
            <div className="productUpload">
              <img src={product.img} alt="" className="productUploadImg" />
              <label for="file">
                <Publish/>
              </label>
              <input type="file" id="file" style={{ display: "none" }} />
            </div>
            <button className="productButton">Update</button>
          </div>
        </form>
      </div>
    </div>
  );
}