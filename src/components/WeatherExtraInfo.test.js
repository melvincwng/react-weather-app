import { render, screen, fireEvent } from '@testing-library/react';
import WeatherExtraInfo from './WeatherExtraInfo';

test('should display icon or info', () => {
  const { getByText, getByAltText } = render(<WeatherExtraInfo align="left" info="20 %" description="humidity" image="humidity.svg" imageAlt="umbrella"/>);
  expect(getByText("20 %")).toBeInTheDocument();
  expect(getByText("humidity")).toBeInTheDocument();
  expect(getByAltText("umbrella")).toBeInTheDocument();
})