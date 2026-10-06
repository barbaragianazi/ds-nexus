import type { Meta, StoryObj } from '@storybook/react-vite'
import { EffectPage } from './EffectPage'

const ElevationPage = () => (
  <EffectPage group="shadow" title="Elevation" description="Sombras que indicam hierarquia e profundidade (effects/shadow)." />
)

const meta = {
  title: 'Foundations/Elevation',
  component: ElevationPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof ElevationPage>

export default meta
type Story = StoryObj<typeof meta>

export const Elevation: Story = {}
