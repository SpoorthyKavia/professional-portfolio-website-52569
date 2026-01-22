import { render, screen } from '@testing-library/react';
import App from './App';

test('renders navigation items', () => {
  render(<App />);
  expect(screen.getByText(/About/i)).toBeInTheDocument();
  expect(screen.getByText(/Projects/i)).toBeInTheDocument();
  expect(screen.getByText(/Skills/i)).toBeInTheDocument();
  expect(screen.getByText(/Contact/i)).toBeInTheDocument();
});
