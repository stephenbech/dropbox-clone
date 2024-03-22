import React from "react";

interface PaginationProps {
   usersPerPage: number;
   totalUsers: number;
   paginate: (pageNumber: number) => void;
 }

const Pagination: React.FC<PaginationProps> = ({ usersPerPage, totalUsers, paginate }) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalUsers / usersPerPage); i++) {
    pageNumbers.push(i);
  }
  return (
    <nav className='aria-label="Page navigation'>
      <ul className="pagination list-style-none flex mt-5 justify-end">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item">
            <a
              onClick={() => paginate(number)}
              href="#"
              className="page-link relative block rounded bg-gray-100 mr-1 px-3 py-1.5 text-sm hover:no-underline text-neutral-600 transition-all duration-300 focus:bg-gray-300 hover:bg-gray-300 dark:text-neutral-900 dark:hover:bg-neutral-700 dark:hover:text-white"
            >
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Pagination;