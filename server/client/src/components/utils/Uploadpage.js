import React,{useState} from 'react';
import FileUpload from "./FileUpload";
const Uploadpage=()=>{
    const [title,setTitle]=useState("");
    const [description,setDescription]=useState("");
    const [price,setPrice]=useState(0);
    const [continent,setContinent]=useState(1);
    const [images,setImages]=useState([]);
    const onTitleChange=(event)=>{
        setTitle(event.target.value);
    }
    const onDescriptionChange=(event)=>{
        setDescription(event.target.value);
    }
    const onPriceChange=(event)=>{
        setPrice(event.target.value)
    }
    const updateImages=(newImages)=>{
        setImages(newImages);
    }
    return (
        <div  className="mycard">
        <div className="card auth-card">
            <h4>upload Product</h4>
            <FileUpload refreshFunction={updateImages}/>
            <label>Title</label>
            <input
            type="text"
             onChange={onTitleChange}
            value={title}
            />
              <label>Description</label>
           <textarea
          onChange={onDescriptionChange} 
          value={description}
          />
          <label>Price</label>
          <input
          onChange={onPriceChange}
          type="number"
          value={price}
          />
           <button className="btn waves-effect waves-light" >Submit
        </button>
            </div>
        </div>

       

    
    )
}

export default Uploadpage;
