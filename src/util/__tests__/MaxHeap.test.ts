import MaxHeap from "../maxheap"

describe("Unit Test Suite for MaxHeap Class", () => {
  it("Extracts the max element from the heap", () => {
    const heap = new MaxHeap()

    heap.insert(4, {})
    heap.insert(10, {})
    heap.insert(3, {})
    heap.insert(100, {})

    const max = heap.extractMax()

    expect(max!.key).toBe(100)
  })

  it("Returns null if the heap is empty after calling extract max", () => {
    const heap = new MaxHeap()

    heap.insert(4, {})
    heap.insert(10, {})
    heap.insert(3, {})
    heap.insert(100, {})

    heap.extractMax()
    heap.extractMax()
    heap.extractMax()
    heap.extractMax()

    expect(heap.extractMax()).toBe(null)
  })

  it("Peek what new max element is on the heap after calling extract max", () => {
    const heap = new MaxHeap()

    heap.insert(4, {})
    heap.insert(10, {})
    heap.insert(3, {})
    heap.insert(100, {})
    heap.insert(9, {})
    heap.insert(25, {})
    heap.insert(42, {})
    heap.insert(8, {})

    heap.extractMax()
    heap.extractMax()

    expect(heap.max()!.key).toBe(25)
  })

  it("Peeks what the top element is on the heap", () => {
    const heap = new MaxHeap()

    heap.insert(4, {})
    heap.insert(10, {})
    heap.insert(3, {})
    heap.insert(100, {})

    expect(heap.max()!.key).toBe(100)
  })
})
