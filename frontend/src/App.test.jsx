import { render, screen } from '@testing-library/react';
import App from './App';

test('renders 메뉴를 선택하세요 text', () => {
  render(<App />);
  const linkElement = screen.getByText(/메뉴를 선택하세요/i);
  expect(linkElement).toBeInTheDocument();
});
