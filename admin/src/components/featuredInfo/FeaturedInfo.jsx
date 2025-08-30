import React, { useEffect, useState } from 'react'
import "./featuredInfo.css";
import { ArrowDownward, ArrowUpward } from '@mui/icons-material';
import { userRequest } from '../../requestMethods';

export default function FeaturedInfo() {
    const [income, setIncome] = useState([]);
    const [perc, setPerc] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const getIncome = async () => {
            try {
                const res = await userRequest.get("orders/income");
                if (res.data && res.data.length >= 2) {
                    setIncome(res.data);
                    setPerc((res.data[1].total * 100) / res.data[0].total - 100);
                }
            } catch (err) {
                console.error("Error fetching income:", err);
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        const token = localStorage.getItem("persist:root");
        if (token) {
            getIncome();
        } else {
            setLoading(false);
            setError("Please log in to view dashboard data");
        }
    }, []);

  if (loading) {
    return (
        <div className="featured">
            <div className="featuredItem">
                <span className="featuredTitle">Loading dashboard data...</span>
            </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="featured">
            <div className="featuredItem">
                <span className="featuredTitle" style={{ color: 'red' }}>{error}</span>
            </div>
        </div>
    );
  }

  return (
    <div className='featured'>
        <div className="featuredItem">
            <span className="featuredTitle">
                Revenue
            </span>
            <div className="featuredMoneyContainer">
                <span className="featuredMoney">
                    Rs.{income[1]?.total || 0}
                </span>
                <div className="featuredMoneyRate">
                    {!isNaN(perc) && (
                        <>
                            {Math.floor(perc)}%{" "}
                            {perc < 0 ? (
                                <ArrowDownward className='featuredIcon negative'/>
                            ) : (
                                <ArrowUpward className='featuredIcon'/>
                            )}
                        </>
                    )}
                </div>
            </div>
            <span className="featuredSub">Compared to last month</span>
        </div>
        <div className="featuredItem">
            <span className="featuredTitle">
                Sales
            </span>
            <div className="featuredMoneyContainer">
                <span className="featuredMoney">Rs.{income[0]?.total || 0}</span>
                <div className="featuredMoneyRate">
                    <ArrowDownward className='featuredIcon negative'/>
                </div>
            </div>
            <span className="featuredSub">Compared to last month</span>
        </div>
        <div className="featuredItem">
            <span className="featuredTitle">
                Cost
            </span>
            <div className="featuredMoneyContainer">
                <span className="featuredMoney">$2,322</span>
                <div className="featuredMoneyRate">+5.3 <ArrowUpward className='featuredIcon'/></div>
            </div>
            <span className="featuredSub">Compared to last month</span>
        </div>
        
    </div>
  )
}
