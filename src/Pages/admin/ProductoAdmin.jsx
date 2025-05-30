import React, { useState, useEffect } from 'react';
import { Link, useLocation } from "react-router-dom";
import { NumericFormat } from 'react-number-format';

import Producto from '../../components/Producto';

import API from '../../config/Api';

export default function ProductoAdmin() {
    
    return (
        <div className=''>
            <Producto/>
        </div>
    );

}
