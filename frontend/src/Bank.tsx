import { Item } from './Inventory'

export class Bank {
  private storage: Map<string, number> = new Map()

  deposit(item: Item) {
    const current = this.storage.get(item.id) || 0
    this.storage.set(item.id, current + item.quantity)
  }

  withdraw(itemId: string, amount: number): boolean {
    const current = this.storage.get(itemId) || 0
    if (current >= amount) {
      this.storage.set(itemId, current - amount)
      return true
    }
    return false
  }

  getBalance(itemId: string): number {
    return this.storage.get(itemId) || 0
  }

  getAll(): { id: string; quantity: number }[] {
    return Array.from(this.storage.entries()).map(([id, quantity]) => ({ id, quantity }))
  }
}