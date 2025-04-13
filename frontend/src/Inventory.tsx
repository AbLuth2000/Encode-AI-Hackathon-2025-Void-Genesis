export type Item = {
    id: string
    name: string
    quantity: number
  }
  
  export class Inventory {
    private items: Item[] = []
  
    addItem(item: Item) {
      const existing = this.items.find(i => i.id === item.id)
      if (existing) {
        existing.quantity += item.quantity
      } else {
        this.items.push({ ...item })
      }
    }
  
    removeItem(itemId: string, amount: number) {
      const item = this.items.find(i => i.id === itemId)
      if (item) {
        item.quantity -= amount
        if (item.quantity <= 0) {
          this.items = this.items.filter(i => i.id !== itemId)
        }
      }
    }
  
    getItems(): Item[] {
      return [...this.items]
    }
  
    hasItem(itemId: string, amount: number): boolean {
      const item = this.items.find(i => i.id === itemId)
      return !!item && item.quantity >= amount
    }
  }