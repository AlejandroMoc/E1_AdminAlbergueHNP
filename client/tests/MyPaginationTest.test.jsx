import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import { describe, it, expect, vi } from 'vitest';
import MyPagination from '../src/components/universal/MyPagination';

describe('MyPagination Component', () => {
  const renderComponent = (props) => {
    return render(<MyPagination {...props} />)
  }

  it('Render del componente', () => {
    renderComponent({ itemsCount: 100, itemsPerPage: 10, currentPage: 1, setCurrentPage: vi.fn() })
  })

  it('Número de páginas correspondiente', () => {
    renderComponent({ itemsCount: 50, itemsPerPage: 10, currentPage: 1, setCurrentPage: vi.fn() })
    expect(screen.getAllByRole('button')).toHaveLength(5)
  })

  it('No va antes de la página 1', () => {
    const setCurrentPage = vi.fn()
    renderComponent({ itemsCount: 50, itemsPerPage: 10, currentPage: 1, setCurrentPage })
    fireEvent.click(screen.getByText('‹'))
    expect(setCurrentPage).not.toHaveBeenCalled()
  })

  it('No va después de la última página', () => {
    const setCurrentPage = vi.fn()
    renderComponent({ itemsCount: 50, itemsPerPage: 10, currentPage: 5, setCurrentPage })
    fireEvent.click(screen.getByText('›'))
    expect(setCurrentPage).toHaveBeenCalled()
  })

  it('Va a la página especificada', () => {
    const setCurrentPage = vi.fn()
    renderComponent({ itemsCount: 50, itemsPerPage: 10, currentPage: 1, setCurrentPage })
    fireEvent.click(screen.getByText('3'))
    expect(setCurrentPage).toHaveBeenCalledWith(3)
  })

  it('Las páginas de números grandes son "..."', () => {
    renderComponent({ itemsCount: 200, itemsPerPage: 10, currentPage: 1, setCurrentPage: vi.fn() })
    expect(screen.getAllByText('…')).toHaveLength(1)
  })

  it('Cambia el valor de current page a la última, si esta la sobrepasa', () => {
    const setCurrentPage = vi.fn()
    renderComponent({ itemsCount: 50, itemsPerPage: 10, currentPage: 6, setCurrentPage })
    expect(setCurrentPage).toHaveBeenCalledWith(5)
  })

  it('No renderiza paginación si hay 0 items', () => {
    renderComponent({ itemsCount: 0, itemsPerPage: 10, currentPage: 1, setCurrentPage: vi.fn() })
    expect(screen.queryByRole('navigation')).toBeNull()
  })
})
