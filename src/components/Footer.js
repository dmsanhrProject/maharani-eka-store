import React from 'react';
import logo from '../assets/LOGO-W.jpg';
import visa from '../assets/visa.png';
import mastercard from '../assets/mastercard.png';
import bca from '../assets/bca.png';
import mandiri from '../assets/mandiri.png';
import bri from '../assets/bri.png';
import bni from '../assets/bni.png';
import shopee from '../assets/shopee.png';
import tiktok from '../assets/tiktok.png';

const Footer = () => {
  return (
    <footer className='bg-red mt-5'>
        <div className="py-5 container d-none d-md-block">
            <div className="row">
                <div className="col-sm-6 mb-5 mb-sm-0 d-flex align-items-center">
                    <img src={logo} alt="" style={{mixBlendMode:'screen',aspectRatio:'1/1',width:'10vw',maxWidth:'142px'}}/>
                    <h1 className="text-white mb-0 ms-3 ps-3 pt-1 border-start border-white font-logo">Maharani Eka</h1>
                </div>
                <div className="col-6 col-sm-3">
                    <h5 className="text-white fw-bold"><b>Jelajahi</b></h5>
                    <a className='text-decoration-none' href="/">Home</a>
                    <a className='text-decoration-none' href="/shop">Shop</a>
                    <a className='text-decoration-none' href="/seller">Seller</a>
                    <a className='text-decoration-none' href="/contact">Hubungi Kami</a>
                </div>
                <div className="col-6 col-sm-3">
                    {/* <div>
                        <h5 className="text-white fw-bold"><b>Lokasi Kami</b></h5>
                        <p className="text-white" style={{marginTop: '18px'}}>
                            Jl. Malang no 23 Jawa Timur
                        </p>
                    </div> */}
                    <div>
                        <h5 className="text-white fw-bold"><b>Pembayaran</b></h5>
                        <div style={{marginTop: '18px'}} className='d-flex flex-wrap justify-content-bewtween'>
                            <div style={{width:'50%'}} className='mb-2'>
                                <img src={visa} alt="" style={{width:"auto",height:"25px"}} />
                            </div>
                            <div style={{width:'50%'}} className='mb-2'>
                                <img src={mastercard} alt="" style={{width:"auto",height:"25px"}} />
                            </div>
                            <div style={{width:'50%'}} className='mb-2'>
                                <img src={mandiri} alt="" style={{width:"auto",height:"25px"}} />
                            </div>
                            <div style={{width:'50%'}} className='mb-2'>
                                <img src={bca} alt="" style={{width:"auto",height:"25px"}} />
                            </div>
                            <div style={{width:'50%'}} className='mb-2'>
                                <img src={bri} alt="" style={{width:"auto",height:"25px"}} />
                            </div>
                            <div style={{width:'50%'}} className='mb-2'>
                                <img src={bni} alt="" style={{width:"auto",height:"25px"}} />
                            </div>
                            <div style={{width:'50%'}} className='mb-2'>
                                <img src={tiktok} alt="" style={{width:"auto",height:"25px"}} />
                            </div>
                            <div style={{width:'50%'}} className='mb-2'>
                                <img src={shopee} alt="" style={{width:"auto",height:"25px"}} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div className="w-100 border-top py-3 px-5">
            <div className="container">
                <h6 className="m-0 text-white">©2024 Maharani Eka Store</h6>
            </div>
        </div>
    </footer>
  );
};

export default Footer;
