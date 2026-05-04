"use client"

import Image from "next/image"

interface Props{
  name:string
  price:number
  image:string
  description:string
}

export default function ProductDetails({name,price,image,description}:Props){

  return(

    <section className="product-details">

      <div className="product-img">

        <Image
          src={image}
          alt={name}
          width={600}
          height={600}
        />

      </div>

      <div className="product-info">

        <h1>{name}</h1>

        <p className="price">₹{price}</p>

        <p className="desc">{description}</p>

        <button className="add-btn">
          Add To Cart
        </button>

      </div>

      <style jsx>{`

      .product-details{
        display:grid;
        grid-template-columns:1fr 1fr;
        gap:60px;
        padding:120px 6%;
      }

      .product-img img{
        width:100%;
        border-radius:16px;
      }

      h1{
        font-size:40px;
        font-weight:800;
      }

      .price{
        margin-top:10px;
        font-size:22px;
      }

      .desc{
        margin-top:20px;
        color:#555;
        line-height:1.6;
      }

      .add-btn{
        margin-top:30px;
        padding:16px 40px;
        background:black;
        color:white;
        border-radius:30px;
        font-weight:600;
      }

      `}</style>

    </section>

  )

}