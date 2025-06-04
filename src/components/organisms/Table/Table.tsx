import React, { useState, useEffect } from 'react';
import { FaSort, FaSortUp, FaSortDown, FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { Typography } from '../../atoms/Typography/Typography';
import { Button } from '../../atoms/Button/Button';

export type SortDirection = 'asc' | 'desc' | null;

export interface TableColumn<T = any> {
  key: string;
  header: React.ReactNode;
  accessor?: (row: T) => React.ReactNode;
  sortable?: boolean;
  width?: string | number;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T = any> {
  // Core content
  columns: TableColumn<T>[];
  data: T[];
  keyExtractor: (row: T) => string | number;
  
  // Style and layout
  variant?: 'default' | 'striped' | 'bordered' | 'minimal';
  size?: 'sm' | 'md' | 'lg';
  stickyHeader?: boolean;
  
  // Behavior
  sortable?: boolean;
  defaultSortColumn?: string;
  defaultSortDirection?: SortDirection;
  
  // Pagination
  pagination?: boolean;
  pageSize?: number;
  pageSizeOptions?: number[];
  
  // Interaction
  selectable?: boolean;
  selectedRows?: (string | number)[];
  onRowSelect?: (selectedKeys: (string | number)[]) => void;
  onRowClick?: (row: T) => void;
  emptyState?: React.ReactNode;
  loading?: boolean;
  loadingRows?: number;
  
  // HTML props
  className?: string;
  id?: string;
  ariaLabel?: string;
}

export const Table = <T extends any>({
  // Core content
  columns,
  data,
  keyExtractor,
  
  // Style and layout
  variant = 'default',
  size = 'md',
  stickyHeader = false,
  
  // Behavior
  sortable = false,
  defaultSortColumn,
  defaultSortDirection = null,
  
  // Pagination
  pagination = false,
  pageSize: initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50],
  
  // Interaction
  selectable = false,
  selectedRows = [],
  onRowSelect,
  onRowClick,
  emptyState,
  loading = false,
  loadingRows = 3,
  
  // HTML props
  className = '',
  id,
  ariaLabel,
}: TableProps<T>) => {
  // State for sorting
  const [sortColumn, setSortColumn] = useState<string | null>(defaultSortColumn || null);
  const [sortDirection, setSortDirection] = useState<SortDirection>(defaultSortDirection);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(initialPageSize);
  
  // State for selection
  const [selected, setSelected] = useState<(string | number)[]>(selectedRows);
  
  // Reset pagination when data changes
  useEffect(() => {
    setCurrentPage(1);
  }, [data.length]);
  
  // Update internal selected state when prop changes
  useEffect(() => {
    setSelected(selectedRows);
  }, [selectedRows]);
  
  // Sort the data
  const sortedData = React.useMemo(() => {
    if (!sortColumn || !sortDirection) {
      return [...data];
    }
    
    const column = columns.find(col => col.key === sortColumn);
    if (!column) {
      return [...data];
    }
    
    return [...data].sort((a, b) => {
      const valueA = column.accessor ? column.accessor(a) : (a as any)[sortColumn];
      const valueB = column.accessor ? column.accessor(b) : (b as any)[sortColumn];
      
      // Convert to string for comparison if not already
      const strA = typeof valueA === 'string' ? valueA : String(valueA);
      const strB = typeof valueB === 'string' ? valueB : String(valueB);
      
      if (sortDirection === 'asc') {
        return strA.localeCompare(strB);
      } else {
        return strB.localeCompare(strA);
      }
    });
  }, [data, sortColumn, sortDirection, columns]);
  
  // Handle sorting
  const handleSort = (columnKey: string) => {
    if (!sortable) return;
    
    const column = columns.find(col => col.key === columnKey);
    if (!column || column.sortable === false) return;
    
    if (sortColumn === columnKey) {
      // Toggle direction if already sorting by this column
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else if (sortDirection === 'desc') {
        setSortDirection(null);
        setSortColumn(null);
      } else {
        setSortDirection('asc');
      }
    } else {
      // Set new sort column
      setSortColumn(columnKey);
      setSortDirection('asc');
    }
  };
  
  // Get sort icon for column header
  const getSortIcon = (columnKey: string) => {
    if (!sortable) return null;
    
    const column = columns.find(col => col.key === columnKey);
    if (!column || column.sortable === false) return null;
    
    if (sortColumn === columnKey) {
      if (sortDirection === 'asc') {
        return <FaSortUp className="ml-1" size={14} />;
      } else if (sortDirection === 'desc') {
        return <FaSortDown className="ml-1" size={14} />;
      }
    }
    
    return <FaSort className="ml-1 opacity-30" size={14} />;
  };
  
  // Pagination calculations
  const totalPages = Math.ceil(sortedData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, sortedData.length);
  const paginatedData = pagination ? sortedData.slice(startIndex, endIndex) : sortedData;
  
  // Handle page change
  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
  };
  
  // Handle page size change
  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setCurrentPage(1); // Reset to first page
  };
  
  // Handle row selection
  const handleRowSelect = (rowKey: string | number) => {
    if (!selectable || !onRowSelect) return;
    
    const newSelected = selected.includes(rowKey)
      ? selected.filter(key => key !== rowKey)
      : [...selected, rowKey];
    
    setSelected(newSelected);
    onRowSelect(newSelected);
  };
  
  // Handle "select all" checkbox
  const handleSelectAll = () => {
    if (!selectable || !onRowSelect) return;
    
    if (selected.length === (pagination ? paginatedData.length : data.length)) {
      // Deselect all
      setSelected([]);
      onRowSelect([]);
    } else {
      // Select all
      const allKeys = (pagination ? paginatedData : data).map(row => keyExtractor(row));
      setSelected(allKeys);
      onRowSelect(allKeys);
    }
  };
  
  // Variant styles
  const variantStyles = {
    default: 'bg-bg-surface',
    striped: 'bg-bg-surface [&>tbody>tr:nth-child(even)]:bg-bg-surface-hover',
    bordered: 'bg-bg-surface border-b border-border [&>thead>tr>th]:border-r [&>thead>tr>th:last-child]:border-r-0 [&>tbody>tr>td]:border-r [&>tbody>tr>td:last-child]:border-r-0 [&>tbody>tr]:border-b [&>tbody>tr:last-child]:border-b-0',
    minimal: 'bg-transparent',
  };
  
  // Size styles
  const sizeStyles = {
    sm: 'text-sm [&>thead>tr>th]:px-2 [&>thead>tr>th]:py-2 [&>tbody>tr>td]:px-2 [&>tbody>tr>td]:py-1',
    md: 'text-base [&>thead>tr>th]:px-3 [&>thead>tr>th]:py-3 [&>tbody>tr>td]:px-3 [&>tbody>tr>td]:py-2',
    lg: 'text-lg [&>thead>tr>th]:px-4 [&>thead>tr>th]:py-4 [&>tbody>tr>td]:px-4 [&>tbody>tr>td]:py-3',
  };
  
  // Render skeleton loader for table rows
  const renderSkeleton = () => {
    return Array(loadingRows)
      .fill(null)
      .map((_, rowIndex) => (
        <tr key={`skeleton-${rowIndex}`} className="animate-pulse">
          {selectable && (
            <td className="border-b border-border">
              <div className="h-4 w-4 mx-auto bg-bg-surface-hover rounded"></div>
            </td>
          )}
          {columns.map((column, colIndex) => (
            <td 
              key={`skeleton-${rowIndex}-${colIndex}`} 
              className="border-b border-border"
              style={{ 
                width: column.width,
                textAlign: column.align || 'left'
              }}
            >
              <div className="h-4 rounded bg-bg-surface-hover w-3/4 mx-auto"></div>
            </td>
          ))}
        </tr>
      ));
  };
  
  // Render empty state when no data is available
  const renderEmptyState = () => {
    return (
      <tr>
        <td 
          colSpan={columns.length + (selectable ? 1 : 0)} 
          className="text-center py-8 text-text-muted"
        >
          {emptyState || (
            <div className="flex flex-col items-center justify-center">
              <Typography variant="body1" align="center" colorScheme="muted">
                No data available
              </Typography>
            </div>
          )}
        </td>
      </tr>
    );
  };
  
  return (
    <div className={`w-full ${className}`}>
      {/* Table container */}
      <div className="w-full overflow-x-auto">
        <table 
          id={id}
          className={`w-full border-collapse ${variantStyles[variant]} ${sizeStyles[size]}`}
          aria-label={ariaLabel}
        >
          {/* Table header */}
          <thead className={stickyHeader ? 'sticky top-0 z-10 bg-bg-surface shadow-sm' : ''}>
            <tr className="border-b border-border">
              {/* Selection checkbox */}
              {selectable && (
                <th className="font-semibold w-10">
                  <div className="flex justify-center items-center">
                    <input 
                      type="checkbox" 
                      checked={
                        paginatedData.length > 0 &&
                        selected.length === (pagination ? paginatedData.length : data.length)
                      }
                      onChange={handleSelectAll}
                      className="h-4 w-4 rounded border-border"
                    />
                  </div>
                </th>
              )}
              
              {/* Column headers */}
              {columns.map(column => (
                <th 
                  key={column.key}
                  className={`font-semibold ${sortable && column.sortable !== false ? 'cursor-pointer select-none' : ''}`}
                  onClick={() => sortable && column.sortable !== false && handleSort(column.key)}
                  style={{ 
                    width: column.width,
                    textAlign: column.align || 'left'
                  }}
                >
                  <div className={`flex items-center ${column.align === 'center' ? 'justify-center' : column.align === 'right' ? 'justify-end' : 'justify-start'}`}>
                    {column.header}
                    {sortable && column.sortable !== false && getSortIcon(column.key)}
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          
          {/* Table body */}
          <tbody>
            {loading ? (
              renderSkeleton()
            ) : paginatedData.length === 0 ? (
              renderEmptyState()
            ) : (
              paginatedData.map((row, rowIndex) => {
                const rowKey = keyExtractor(row);
                const isSelected = selected.includes(rowKey);
                
                return (
                  <motion.tr
                    key={rowKey}
                    className={`border-b border-border ${onRowClick ? 'cursor-pointer hover:bg-bg-surface-hover' : ''} ${isSelected ? 'bg-primary/5' : ''}`}
                    onClick={() => onRowClick && onRowClick(row)}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.2,
                      delay: Math.min(rowIndex * 0.05, 0.3) // Stagger effect but cap at 300ms
                    }}
                  >
                    {/* Selection checkbox */}
                    {selectable && (
                      <td className="border-b border-border">
                        <div className="flex justify-center items-center" onClick={e => e.stopPropagation()}>
                          <input 
                            type="checkbox" 
                            checked={isSelected}
                            onChange={() => handleRowSelect(rowKey)}
                            className="h-4 w-4 rounded border-border"
                          />
                        </div>
                      </td>
                    )}
                    
                    {/* Row cells */}
                    {columns.map(column => (
                      <td 
                        key={`${rowKey}-${column.key}`}
                        style={{ 
                          textAlign: column.align || 'left'
                        }}
                      >
                        {column.accessor 
                          ? column.accessor(row) 
                          : (row as any)[column.key]}
                      </td>
                    ))}
                  </motion.tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
      
      {/* Pagination */}
      {pagination && !loading && data.length > 0 && (
        <div className="flex flex-wrap items-center justify-between gap-4 mt-4 px-2">
          {/* Page size selector */}
          <div className="flex items-center gap-2">
            <Typography variant="body2" colorScheme="muted">
              Rows per page:
            </Typography>
            <select
              value={pageSize}
              onChange={e => handlePageSizeChange(Number(e.target.value))}
              className="bg-bg-surface border border-border rounded px-2 py-1 text-sm"
            >
              {pageSizeOptions.map(size => (
                <option key={size} value={size}>
                  {size}
                </option>
              ))}
            </select>
          </div>
          
          {/* Page information */}
          <div className="text-text-muted text-sm">
            {startIndex + 1}-{endIndex} of {sortedData.length}
          </div>
          
          {/* Page navigation */}
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              leftIcon={FaChevronLeft}
              aria-label="Previous page"
            />
            
            {/* Page numbers */}
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }).map((_, i) => {
                // Simple algorithm to show pages around current page
                let pageNum;
                if (totalPages <= 5) {
                  pageNum = i + 1;
                } else if (currentPage <= 3) {
                  pageNum = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNum = totalPages - 4 + i;
                } else {
                  pageNum = currentPage - 2 + i;
                }
                
                return (
                  <Button
                    key={pageNum}
                    variant={currentPage === pageNum ? 'primary' : 'ghost'}
                    size="sm"
                    onClick={() => handlePageChange(pageNum)}
                  >
                    {pageNum}
                  </Button>
                );
              })}
            </div>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              rightIcon={FaChevronRight}
              aria-label="Next page"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default Table; 