import { useEffect, useState } from "react";

interface Product {
  id: number;
  title: string;
  price: number;
  description?: string;
  img?: string;
}

const Index = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState<number | ''>('');
  const [description, setDescription] = useState('');
  const [img, setImg] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch("http://localhost:8000/products", {
          cache: "no-cache",
        });
        if (!res.ok) {
          throw new Error('Failed to fetch products');
        }
        const data: Product[] = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Fetch error:", error);
      }
    };

    fetchData();
  }, []);

  const addProduct = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!title || !price || !description || !img) {
      setError('All fields are required');
      setSuccess('');
      return;
    }

    const newProduct = { title, price: parseFloat(price as string), description, img };

    try {
      const res = await fetch("http://localhost:8000/products", {
        method: "POST",
        body: JSON.stringify(newProduct),
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error('Failed to add product');
      }

      const fetchRes = await fetch("http://localhost:8000/products", {
        cache: "no-cache",
      });

      if (!fetchRes.ok) {
        throw new Error('Failed to fetch updated products');
      }

      const data: Product[] = await fetchRes.json();
      setProducts(data);
      setSuccess('Product added successfully!');
      setError('');
      setTitle('');
      setPrice('');
      setDescription('');
      setImg('');
    } catch (error) {
      console.error("Fetch error:", error);
      setError('Failed to add product');
      setSuccess('');
    }
  };

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
      <h1>Product Belissimo</h1>
      <form onSubmit={addProduct} style={{ display: 'flex', flexDirection: 'column', width: '100%', maxWidth: '500px' }}>
        <input
          type="text"
          name="title"
          placeholder="Product Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={{ padding: '10px', marginBottom: '10px', width: '100%', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          style={{ padding: '10px', marginBottom: '10px', width: '100%', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <input
          type="text"
          name="description"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          style={{ padding: '10px', marginBottom: '10px', width: '100%', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <input
          type="text"
          name="img"
          placeholder="Image URL"
          value={img}
          onChange={(e) => setImg(e.target.value)}
          style={{ padding: '10px', marginBottom: '10px', width: '100%', boxSizing: 'border-box', border: '1px solid #ddd', borderRadius: '4px' }}
        />
        <button type="submit" style={{ padding: '10px', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
          Add
        </button>
        {error && <p style={{ color: 'red', marginTop: '10px' }}>{error}</p>}
        {success && <p style={{ color: 'green', marginTop: '10px' }}>{success}</p>}
      </form>
      <div style={{ marginTop: '20px', width: '100%', display: 'flex', flexWrap: 'wrap', justifyContent: 'center' }}>
        {products.map((i, idx) => (
          <div key={i.id} style={{ width: '300px', margin: '10px', padding: '10px', border: '1px solid #ddd', borderRadius: '4px', boxShadow: '0 0 5px rgba(0,0,0,0.1)' }}>
            <h2>{i.title}</h2>
            <p>Price: ${i.price}</p>
            {i.description && <p>Description: {i.description}</p>}
            {i.img && (
              <>
                <img src={i.img} alt={i.title} style={{ width: '100%', height: 'auto', borderRadius: '4px' }} />
                {/* Debugging: Uncomment to log the image URL */}
                {/* <p>Image URL: {i.img}</p> */}
              </>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Index;
