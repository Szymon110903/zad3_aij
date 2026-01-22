import React from 'react';

function Pagination({ itemsPerPage, totalItems, paginate, currentPage }) {
    const pageNumbers = [];

    for (let i = 1; i <= Math.ceil(totalItems / itemsPerPage); i++) {
        pageNumbers.push(i);
    }

    if (pageNumbers.length <= 1) return null; 

    return (
        <nav className="d-flex justify-content-center mt-4">
            <ul className="pagination shadow-sm">
                
                <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button onClick={() => paginate(currentPage - 1)} className="page-link">
                        &laquo;
                    </button>
                </li>

                {pageNumbers.map(number => (
                    <li key={number} className={`page-item ${currentPage === number ? 'active' : ''}`}>
                        <button onClick={() => paginate(number)} className="page-link">
                            {number}
                        </button>
                    </li>
                ))}

                <li className={`page-item ${currentPage === pageNumbers.length ? 'disabled' : ''}`}>
                    <button onClick={() => paginate(currentPage + 1)} className="page-link">
                        &raquo;
                    </button>
                </li>
            </ul>
        </nav>
    );
}

export default Pagination;