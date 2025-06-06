import React, { useState, useEffect, useMemo } from 'react';
import { Table } from '../Table';
import { Input } from '../../atoms/Input';
import { Button } from '../../atoms/Button/Button';
import { Select } from '../../atoms/Select';
import { FiSearch, FiFilter, FiChevronLeft, FiChevronRight, FiChevronsLeft, FiChevronsRight, FiArrowUp, FiArrowDown } from 'react-icons/fi';

export type SortDirection = 'asc' | 'desc' | null;

export type DataGridColumn<T> = {
  /**
   * Column identifier
   */
  id: string;
  
  /**
   * Column header
   */
  header: React.ReactNode;
  
  /**
   * Cell render function
   */
  cell: (row: T, rowIndex: number) => React.ReactNode;
  
  /**
   * Whether column is sortable
   */
  sortable?: boolean;
  
  /**
   * Column filter component (custom or by type)
   */
  filter?: 'text' | 'number' | 'date' | 'select' | React.ReactNode;
  
  /**
   * Filter options for select filter
   */
  filterOptions?: { label: string; value: any }[];
  
  /**
   * Cell CSS class
   */
  className?: string;
  
  /**
   * Header CSS class
   */
  headerClassName?: string;
  
  /**
   * Column minimum width
   */
  minWidth?: number | string;
  
  /**
   * Column maximum width
   */
  maxWidth?: number | string;
  
  /**
   * Whether column is visible
   */
  hidden?: boolean;
  
  /**
   * Whether column is fixed/sticky
   */
  fixed?: boolean;
  
  /**
   * Custom data accessor (for sorting and filtering)
   */
  accessor?: (row: T) => any;
};

export type FilterValue = {
  columnId: string;
  value: any;
  operator?: 'equals' | 'contains' | 'startsWith' | 'endsWith' | 'greaterThan' | 'lessThan' | 'between';
};

export interface DataGridProps<T> {
  /**
   * Grid data
   */
  data: T[];
  
  /**
   * Grid columns
   */
  columns: DataGridColumn<T>[];
  
  /**
   * Whether to show toolbar
   */
  showToolbar?: boolean;
  
  /**
   * Whether to show pagination
   */
  showPagination?: boolean;
  
  /**
   * Default page size
   */
  defaultPageSize?: number;
  
  /**
   * Available page sizes
   */
  pageSizeOptions?: number[];
  
  /**
   * Initial sort
   */
  initialSort?: { id: string; direction: SortDirection };
  
  /**
   * Initial filters
   */
  initialFilters?: FilterValue[];
  
  /**
   * Row key function
   */
  getRowId?: (row: T) => string | number;
  
  /**
   * Row click handler
   */
  onRowClick?: (row: T, index: number) => void;
  
  /**
   * CSS class for the grid
   */
  className?: string;
  
  /**
   * CSS class for each row
   */
  rowClassName?: string | ((row: T, index: number) => string);
  
  /**
   * Whether to show borders
   */
  bordered?: boolean;
  
  /**
   * Whether rows are striped
   */
  striped?: boolean;
  
  /**
   * Whether rows are hoverable
   */
  hoverable?: boolean;
  
  /**
   * Text to show when no data
   */
  noDataText?: string;
  
  /**
   * Text to show when loading
   */
  loadingText?: string;
  
  /**
   * Whether data is loading
   */
  isLoading?: boolean;
  
  /**
   * Whether to allow multi-column sorting
   */
  allowMultiSort?: boolean;
  
  /**
   * Grid height
   */
  height?: number | string;
  
  /**
   * Sort change handler
   */
  onSortChange?: (sort: { id: string; direction: SortDirection }[]) => void;
  
  /**
   * Filter change handler
   */
  onFilterChange?: (filters: FilterValue[]) => void;
  
  /**
   * Page change handler
   */
  onPageChange?: (page: number) => void;
  
  /**
   * Page size change handler
   */
  onPageSizeChange?: (pageSize: number) => void;
  
  /**
   * External data load handler (for server-side operations)
   */
  onDataRequest?: (params: {
    page: number;
    pageSize: number;
    sort: { id: string; direction: SortDirection }[];
    filters: FilterValue[];
  }) => Promise<{ data: T[]; totalCount: number }>;
  
  /**
   * Total count for server-side pagination
   */
  totalCount?: number;
}

export const DataGrid = <T extends object>({
  data,
  columns,
  showToolbar = true,
  showPagination = true,
  defaultPageSize = 10,
  pageSizeOptions = [10, 25, 50, 100],
  initialSort,
  initialFilters = [],
  getRowId,
  onRowClick,
  className = '',
  rowClassName = '',
  bordered = true,
  striped = true,
  hoverable = true,
  noDataText = 'No data available',
  loadingText = 'Loading...',
  isLoading = false,
  allowMultiSort = false,
  height,
  onSortChange,
  onFilterChange,
  onPageChange,
  onPageSizeChange,
  onDataRequest,
  totalCount: externalTotalCount
}: DataGridProps<T>) => {
  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);
  
  // Sorting state
  const [sortState, setSortState] = useState<{ id: string; direction: SortDirection }[]>(
    initialSort ? [initialSort] : []
  );
  
  // Filtering state
  const [filterValues, setFilterValues] = useState<FilterValue[]>(initialFilters);
  const [globalFilter, setGlobalFilter] = useState('');
  
  // Server-side loading state
  const [serverData, setServerData] = useState<T[] | null>(null);
  const [totalCount, setTotalCount] = useState(0);
  const [isServerLoading, setIsServerLoading] = useState(false);
  
  // Check if using server-side data
  const isServerSide = !!onDataRequest;
  
  // Get visible columns
  const visibleColumns = useMemo(() => {
    return columns.filter(column => !column.hidden);
  }, [columns]);
  
  // Load server-side data
  useEffect(() => {
    if (!isServerSide) return;
    
    const loadData = async () => {
      setIsServerLoading(true);
      try {
        const result = await onDataRequest({
          page: currentPage,
          pageSize,
          sort: sortState,
          filters: filterValues
        });
        
        setServerData(result.data);
        setTotalCount(result.totalCount);
      } catch (error) {
        console.error('Error loading data:', error);
      } finally {
        setIsServerLoading(false);
      }
    };
    
    loadData();
  }, [isServerSide, currentPage, pageSize, sortState, filterValues, onDataRequest]);
  
  // Handle sort change
  const handleSortChange = (columnId: string) => {
    const column = columns.find(col => col.id === columnId);
    
    if (!column?.sortable) return;
    
    let newSortState: { id: string; direction: SortDirection }[];
    
    // Find current sort for this column
    const currentSort = sortState.find(sort => sort.id === columnId);
    
    if (allowMultiSort) {
      if (!currentSort) {
        // Add new sort
        newSortState = [...sortState, { id: columnId, direction: 'asc' }];
      } else {
        // Update existing sort
        newSortState = sortState.map(sort => {
          if (sort.id === columnId) {
            return {
              id: columnId,
              direction: sort.direction === 'asc' ? 'desc' : sort.direction === 'desc' ? null : 'asc'
            };
          }
          return sort;
        }).filter(sort => sort.direction !== null);
      }
    } else {
      // Single column sort
      if (!currentSort) {
        newSortState = [{ id: columnId, direction: 'asc' }];
      } else {
        const nextDirection = currentSort.direction === 'asc' ? 'desc' : 
                            currentSort.direction === 'desc' ? null : 'asc';
        
        newSortState = nextDirection ? [{ id: columnId, direction: nextDirection }] : [];
      }
    }
    
    setSortState(newSortState);
    
    if (onSortChange) {
      onSortChange(newSortState);
    }
  };
  
  // Apply sorting to data
  const sortedData = useMemo(() => {
    if (isServerSide || sortState.length === 0) {
      return isServerSide ? serverData || [] : data;
    }
    
    return [...data].sort((a, b) => {
      for (const sort of sortState) {
        const column = columns.find(col => col.id === sort.id);
        
        if (!column) continue;
        
        const getValue = (row: T) => {
          if (column.accessor) {
            return column.accessor(row);
          }
          return (row as any)[column.id];
        };
        
        const aValue = getValue(a);
        const bValue = getValue(b);
        
        if (aValue === bValue) continue;
        
        const direction = sort.direction === 'asc' ? 1 : -1;
        
        if (aValue == null) return 1 * direction;
        if (bValue == null) return -1 * direction;
        
        if (typeof aValue === 'string' && typeof bValue === 'string') {
          return aValue.localeCompare(bValue) * direction;
        }
        
        return (aValue > bValue ? 1 : -1) * direction;
      }
      
      return 0;
    });
  }, [isServerSide, serverData, data, sortState, columns]);
  
  // Apply filters to data
  const filteredData = useMemo(() => {
    if (isServerSide) {
      return sortedData;
    }
    
    let result = sortedData;
    
    // Apply column filters
    if (filterValues.length > 0) {
      result = result.filter(row => {
        return filterValues.every(filter => {
          const column = columns.find(col => col.id === filter.columnId);
          
          if (!column) return true;
          
          const getValue = (row: T) => {
            if (column.accessor) {
              return column.accessor(row);
            }
            return (row as any)[column.id];
          };
          
          const value = getValue(row);
          
          if (value == null) return false;
          
          switch (filter.operator) {
            case 'contains':
              return String(value).toLowerCase().includes(String(filter.value).toLowerCase());
            case 'startsWith':
              return String(value).toLowerCase().startsWith(String(filter.value).toLowerCase());
            case 'endsWith':
              return String(value).toLowerCase().endsWith(String(filter.value).toLowerCase());
            case 'greaterThan':
              return Number(value) > Number(filter.value);
            case 'lessThan':
              return Number(value) < Number(filter.value);
            case 'between':
              if (Array.isArray(filter.value) && filter.value.length === 2) {
                return Number(value) >= Number(filter.value[0]) && Number(value) <= Number(filter.value[1]);
              }
              return true;
            default:
              return String(value).toLowerCase() === String(filter.value).toLowerCase();
          }
        });
      });
    }
    
    // Apply global filter
    if (globalFilter) {
      const lowerCaseFilter = globalFilter.toLowerCase();
      
      result = result.filter(row => {
        return visibleColumns.some(column => {
          const getValue = (row: T) => {
            if (column.accessor) {
              return column.accessor(row);
            }
            return (row as any)[column.id];
          };
          
          const value = getValue(row);
          
          if (value == null) return false;
          
          return String(value).toLowerCase().includes(lowerCaseFilter);
        });
      });
    }
    
    return result;
  }, [isServerSide, sortedData, filterValues, globalFilter, columns, visibleColumns]);
  
  // Get paginated data
  const paginatedData = useMemo(() => {
    if (isServerSide) {
      return filteredData;
    }
    
    if (!showPagination) {
      return filteredData;
    }
    
    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    
    return filteredData.slice(start, end);
  }, [isServerSide, filteredData, showPagination, currentPage, pageSize]);
  
  // Get total number of pages
  const totalPages = useMemo(() => {
    const count = isServerSide ? externalTotalCount ?? totalCount : filteredData.length;
    return Math.max(1, Math.ceil(count / pageSize));
  }, [isServerSide, externalTotalCount, totalCount, filteredData.length, pageSize]);
  
  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    
    if (onPageChange) {
      onPageChange(page);
    }
  };
  
  // Handle page size change
  const handlePageSizeChange = (newSize: number) => {
    setPageSize(newSize);
    setCurrentPage(1);
    
    if (onPageSizeChange) {
      onPageSizeChange(newSize);
    }
  };
  
  // Handle filter change
  const handleFilterChange = (columnId: string, value: any, operator: FilterValue['operator'] = 'contains') => {
    const newFilters = filterValues.filter(f => f.columnId !== columnId);
    
    if (value !== '' && value !== null && value !== undefined) {
      newFilters.push({ columnId, value, operator });
    }
    
    setFilterValues(newFilters);
    setCurrentPage(1);
    
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  };
  
  // Handle global filter change
  const handleGlobalFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setGlobalFilter(e.target.value);
    setCurrentPage(1);
  };
  
  // Get the filter value for a column
  const getFilterValue = (columnId: string) => {
    const filter = filterValues.find(f => f.columnId === columnId);
    return filter ? filter.value : '';
  };
  
  // Render sort indicator
  const renderSortIndicator = (columnId: string) => {
    const sort = sortState.find(s => s.id === columnId);
    
    if (!sort) return null;
    
    return sort.direction === 'asc' ? (
      <FiArrowUp className="ml-1 h-4 w-4" />
    ) : (
      <FiArrowDown className="ml-1 h-4 w-4" />
    );
  };
  
  // Render column header
  const renderColumnHeader = (column: DataGridColumn<T>) => {
    return (
      <div 
        className={`flex items-center ${column.sortable ? 'cursor-pointer select-none' : ''}`}
        onClick={() => column.sortable && handleSortChange(column.id)}
      >
        <span>{column.header}</span>
        {column.sortable && renderSortIndicator(column.id)}
      </div>
    );
  };
  
  // Render column filter
  const renderColumnFilter = (column: DataGridColumn<T>) => {
    if (!column.filter) return null;
    
    const filterValue = getFilterValue(column.id);
    
    if (typeof column.filter === 'object') {
      return column.filter;
    }
    
    switch (column.filter) {
      case 'text':
        return (
          <Input
            type="text"
            value={filterValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(column.id, e.target.value)}
            placeholder={`Filter ${column.header}`}
            className="text-sm w-full"
          />
        );
        
      case 'number':
        return (
          <Input
            type="number"
            value={filterValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(column.id, e.target.value, 'equals')}
            placeholder={`Filter ${column.header}`}
            className="text-sm w-full"
          />
        );
        
      case 'date':
        return (
          <Input
            type="date"
            value={filterValue}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFilterChange(column.id, e.target.value, 'equals')}
            className="text-sm w-full"
          />
        );
        
      case 'select':
        return (
          <Select
            value={filterValue}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handleFilterChange(column.id, e.target.value, 'equals')}
            options={[
              { label: 'All', value: '' },
              ...(column.filterOptions || [])
            ]}
            className="text-sm w-full"
          />
        );
        
      default:
        return null;
    }
  };
  
  // Map columns to Table format
  const tableColumns = visibleColumns.map(column => ({
    key: column.id,
    header: renderColumnHeader(column),
    accessor: (row: T) => column.cell(row, 0),
    filter: column.filter ? renderColumnFilter(column) : undefined,
    width: column.minWidth,
    align: 'left' as 'left' | 'center' | 'right',
    searchable: !!column.filter,
    filterable: !!column.filter,
  }));
  
  // Render pagination controls
  const renderPagination = () => {
    if (!showPagination) return null;
    
    const totalItems = isServerSide ? (externalTotalCount ?? totalCount) : filteredData.length;
    const start = Math.min((currentPage - 1) * pageSize + 1, totalItems);
    const end = Math.min(currentPage * pageSize, totalItems);
    
    return (
      <div className="flex items-center justify-between py-3 bg-bg-surface">
        {/* Page size selector */}
        <div className="flex items-center space-x-2">
          <span className="text-sm text-text-muted">Rows per page:</span>
          <Select
            value={pageSize.toString()}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => handlePageSizeChange(Number(e.target.value))}
            options={pageSizeOptions.map(size => ({ 
              label: size.toString(), 
              value: size.toString()
            }))}
            className="text-sm min-w-[80px]"
          />
        </div>
        
        {/* Page info */}
        <div className="hidden md:flex items-center text-sm text-text-muted">
          {totalItems > 0 ? `${start}-${end} of ${totalItems}` : 'No items'}
        </div>
        
        {/* Page controls */}
        <div className="flex items-center space-x-1">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(1)}
            disabled={currentPage === 1}
            aria-label="First page"
          >
            <FiChevronsLeft className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            aria-label="Previous page"
          >
            <FiChevronLeft className="h-4 w-4" />
          </Button>
          
          <span className="px-2 text-sm text-text">
            {currentPage} / {totalPages}
          </span>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            aria-label="Next page"
          >
            <FiChevronRight className="h-4 w-4" />
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handlePageChange(totalPages)}
            disabled={currentPage >= totalPages}
            aria-label="Last page"
          >
            <FiChevronsRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };
  
  // Render toolbar
  const renderToolbar = () => {
    if (!showToolbar) return null;
    
    return (
      <div className="flex flex-wrap items-center justify-between p-2 bg-bg-surface border-b border-border">
        {/* Global search */}
        <div className="relative w-full md:w-64 mb-2 md:mb-0">
          <Input
            type="text"
            value={globalFilter}
            onChange={handleGlobalFilterChange}
            placeholder="Search..."
            className="pr-8"
          />
          <FiSearch className="absolute right-2 top-1/2 transform -translate-y-1/2 text-text-muted h-4 w-4" />
        </div>
        
        {/* Filter indicator */}
        <div className="flex items-center">
          {filterValues.length > 0 && (
            <div className="flex items-center mr-2 text-sm text-text">
              <FiFilter className="mr-1 h-4 w-4" />
              <span>{filterValues.length} active filter{filterValues.length !== 1 ? 's' : ''}</span>
            </div>
          )}
          
          {/* Clear filters button */}
          {filterValues.length > 0 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setFilterValues([]);
                if (onFilterChange) onFilterChange([]);
              }}
            >
              Clear filters
            </Button>
          )}
        </div>
      </div>
    );
  };
  
  return (
    <div className={`border border-border rounded-md overflow-hidden ${className}`}>
      {/* Toolbar */}
      {renderToolbar()}
      
      {/* Table */}
      <div style={{ height: height ? height : 'auto' }} className="overflow-auto">
        <Table
          columns={tableColumns}
          data={paginatedData}
          keyExtractor={getRowId || ((row: any) => row.id?.toString() || Math.random().toString())}
          onRowClick={onRowClick ? (row: T) => onRowClick(row, 0) : undefined}
          className={typeof rowClassName === 'string' ? rowClassName : ''}
          variant={bordered ? 'bordered' : striped ? 'striped' : 'default'}
          emptyState={isLoading || isServerLoading ? <div>{loadingText}</div> : <div>{noDataText}</div>}
          loading={isLoading || isServerLoading}
        />
      </div>
      
      {/* Pagination */}
      {renderPagination()}
    </div>
  );
};

export default DataGrid; 