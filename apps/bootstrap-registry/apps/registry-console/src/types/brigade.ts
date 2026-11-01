export interface BrigadeCardData {
  id: string
  name: string
  brigade: string
  role: string
  focus: string
  tool: string
  slug: string
  mode: string
  color: string
  command: string
}

export interface BrigadeFilterState {
  query: string
  brigade: string
}
