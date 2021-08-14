import React from 'react'
import Table from 'react-bootstrap/Table';

export const Customers = ({customers}) => {

    const CustomerRow = (customer,index) => {

        return(
              <tr key = {index} className='even'>
                  <td> {index + 1} </td>
                  <td>{customer._id}</td>
                  <td>{customer.subtotal}</td>
                  <td>{customer.grandtotal}</td>
                  <td>{customer.discount}</td>
                  <td>{customer.createdAt}</td>
                  <td>{customer.updatedAt}</td>
              </tr>
          )
      }

      const CustomerTable = customers.map((cust,index) => CustomerRow(cust,index))

      const tableHeader = <thead className='bgvi'>
                            <tr>
                                <th>#</th>
                                <th>ID</th>
                                <th>Subtotal</th>
                                <th>Grandtotal</th>
                                <th>Discount</th>
                                <th>createdAt</th>
                                <th>updatedAt</th>
                            </tr>
                        </thead>
    
    return (
        <Table striped bordered hover>
            {tableHeader}
            <tbody>
                {CustomerTable}
            </tbody>
        </Table>
    )
}