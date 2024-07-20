import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BrowserRouter as Router, useNavigate, useLocation, useParams } from 'react-router-dom';
import { describe, it, expect, vi, MockedFunction } from 'vitest';
import {Account} from '../pages/Account';
import OrdersService from '../services/OrdersService';
import { useSession } from '@/components/contexts/AuthProvider';
import { OrderStatus, OrderType, Roles } from 'common-types';

// Mocks
vi.mock('../services/OrdersService');
vi.mock('@/components/contexts/AuthProvider');
vi.mock('react-router-dom', async (importOriginal) => {
  const actual = await importOriginal();
  return {
    ...(actual as object),
    useNavigate: vi.fn(),
    useLocation: vi.fn(),
    useParams: vi.fn(),
  };
});

// Mocked session context
const mockUseSession = {
  isAuthenticated: true,
  token: { token: 'test-token', expiresDate: new Date() } as any,
  login: vi.fn(),
  logout: vi.fn(),
  user: { userUID: 'test-uuid', email: "test@example.com", role: Roles.Customer },
};

(useSession as MockedFunction<typeof useSession>).mockReturnValue(mockUseSession);

// Helper function to render with router
const renderWithRouter = (ui: React.ReactElement) => {
  return render(<Router>{ui}</Router>);
};

describe('ProfilePage', () => {
  const navigate = vi.fn();
  const location = { pathname: '/account/profil' } as any;
  const params = { section: 'profil' } as any;

  beforeEach(() => {
    (useNavigate as MockedFunction<typeof useNavigate>).mockReturnValue(navigate);
    (useLocation as MockedFunction<typeof useLocation>).mockReturnValue(location);
    (useParams as MockedFunction<typeof useParams>).mockReturnValue(params);
  });

  it('should render the profile page with the public profile form by default', () => {
    renderWithRouter(<Account />);
    expect(screen.getByText('Général')).toBeInTheDocument();
  });

  it('should render the orders section when the orders link is clicked', async () => {
    const mockOrders: OrderType[] = [
      {
        id: 1,
        userId: "uuid",
        status: OrderStatus.WaitingForPaiement,
        createdAt: new Date(),
        orderDetails: [{ product: { id:2, imageUrl: '', name: 'Product 1', description:"", price: 700, orderDetails: [] }, quantity: 1, id: 1, orderId: 1}],
      },
    ];

    (OrdersService.getOrdersByUser as MockedFunction<typeof OrdersService.getOrdersByUser>).mockResolvedValue({
      data: mockOrders,
      status: 200,
    });

    renderWithRouter(<Account />);

    fireEvent.click(screen.getByText('Orders'));

    await waitFor(() => expect(screen.getByText('User Orders')).toBeInTheDocument());
    expect(screen.getByText('Order #1')).toBeInTheDocument();
  });

  it('should display error if order fetch fails', async () => {
    const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    (OrdersService.getOrdersByUser as MockedFunction<typeof OrdersService.getOrdersByUser>).mockRejectedValue(new Error('Failed to fetch orders'));

    renderWithRouter(<Account />);

    fireEvent.click(screen.getByText('Orders'));

    await waitFor(() => expect(consoleSpy).toHaveBeenCalledWith('Failed to fetch orders'));
    consoleSpy.mockRestore();
  });

  it('should redirect to the correct section when a link is clicked', async () => {
    renderWithRouter(<Account />);

    fireEvent.click(screen.getByText('Orders'));

    expect(navigate).toHaveBeenCalledWith('/account/orders');
  });

  it('should set the correct content based on URL params', async () => {
    params.section = 'orders';

    renderWithRouter(<Account />);

    await waitFor(() => expect(screen.getByText('User Orders')).toBeInTheDocument());
  });

  it('should fallback to the default section if URL params are invalid', async () => {
    params.section = 'invalid-section';

    renderWithRouter(<Account />);

    await waitFor(() => expect(navigate).toHaveBeenCalledWith('/account/profil'));
    expect(screen.getByText('Général')).toBeInTheDocument();
  });
});
