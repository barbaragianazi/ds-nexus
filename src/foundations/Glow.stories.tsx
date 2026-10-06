import type { Meta, StoryObj } from '@storybook/react-vite'
import { EffectPage } from './EffectPage'

const GlowPage = () => (
  <EffectPage group="glow" title="Glow" description="Brilho de destaque usado em foco e ênfase (effects/glow)." />
)

const meta = {
  title: 'Foundations/Glow',
  component: GlowPage,
  parameters: { layout: 'fullscreen' },
} satisfies Meta<typeof GlowPage>

export default meta
type Story = StoryObj<typeof meta>

export const Glow: Story = {}
