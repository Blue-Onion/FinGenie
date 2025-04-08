import { getAccountWithTransaction } from '@/actions/account';
import NotFound from '@/app/not-found';
import { Suspense } from 'react';
import React from 'react'
import TransactionTable from '../_components/TransactionTable';
import { BarLoader } from 'react-spinners';

const page =async({params}) => {
    const {id}=await params;
    const data=await getAccountWithTransaction(id)
    if(!data){
       return <NotFound/>
    }
    const {transaction,...account}=data.data
    console.log(data);
    
    
  return (

      <div className="space-y-8 ">
        <div className="flex px-5 gap-4 items-end justify-between">

        <div className="">
            <h1 className="text-5xl sm:text-6xl font-bold gradient-title capitalize">{account.name}</h1>
            <p className="text-muted-foreground">{account.type.charAt(0) + account.type.slice(1).toLowerCase()}</p>
        </div>
        <div className="text-right">
            <div className="text-xl sm:text-2xl font-bold">${parseFloat(account.balance).toFixed(2)}</div>
            <p className="text-sm text-muted-foreground">{account._count.transactions} Transactions</p>
        </div>
        {/* Chart Section */}
        {/* Table Section */}
      </div>
        <Suspense fallback={<BarLoader className='mt-4' width={"100%"} color='#9333ea'/>}>

        <TransactionTable transactions={transaction}/>
        </Suspense>
        </div>


  )
}

export default page
