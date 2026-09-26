/**
 * U1–U3. The unistyles mocks apply the first registered theme, `light`.
 */
import { fireEvent, render, screen } from '@testing-library/react-native';

import { Button, Card, Text } from '../../src/shared/ui';
import { themes } from '../../src/theme';

const { button, card, text } = themes.light;

describe('Button', () => {
  it('calls onPress when pressed', async () => {
    const onPress = jest.fn();
    await render(<Button label="Save" onPress={onPress} />);
    await fireEvent.press(screen.getByRole('button', { name: 'Save' }));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it('is disabled and busy while loading (U2)', async () => {
    await render(<Button label="Save" onPress={jest.fn()} loading />);
    const saveButton = screen.getByRole('button');
    expect(saveButton).toBeDisabled();
    expect(saveButton).toBeBusy();
  });

  it.each([
    ['disabled', { disabled: true }],
    ['loading', { loading: true }],
  ])('does not call onPress while %s (U3)', async (_state, props) => {
    const onPress = jest.fn();
    await render(<Button label="Save" onPress={onPress} {...props} />);
    await fireEvent.press(screen.getByRole('button'));
    expect(onPress).not.toHaveBeenCalled();
  });

  it('takes its colours and sizes from the button tokens (U1)', async () => {
    await render(<Button label="Save" onPress={jest.fn()} variant="secondary" />);
    expect(screen.getByRole('button')).toHaveStyle({
      backgroundColor: button.secondary.background,
      borderColor: button.secondary.border,
      borderRadius: button.radius,
      minHeight: button.minHeight,
    });
    expect(screen.getByText('Save')).toHaveStyle({
      color: button.secondary.label,
      fontSize: button.label.fontSize,
    });
  });
});

describe('Text (U1)', () => {
  it('uses the typography variant and tone tokens', async () => {
    await render(
      <Text variant="heading" tone="muted">
        Budgets
      </Text>,
    );
    expect(screen.getByText('Budgets')).toHaveStyle({
      fontSize: text.variants.heading.fontSize,
      color: text.tones.muted,
    });
  });
});

describe('Card (U1)', () => {
  it('uses the card tokens', async () => {
    await render(
      <Card>
        <Text>Inside</Text>
      </Card>,
    );
    expect(screen.getByText('Inside').parent).toHaveStyle({
      backgroundColor: card.background,
      borderRadius: card.radius,
      padding: card.padding,
    });
  });
});
