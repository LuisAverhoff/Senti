interface HeapNode {
  key: number | string
  value: object
}

interface HeapProps {
  /*
   * Insert the heap node at the end of the array and sift the node up if needed.
   */
  insert(k: number | string, v: object): void
  /*
   * Gets the max node at index 0.
   */
  max(): HeapNode | null
  /*
   * Returns the max node at index 0 and rebuildsthe heap.
   */
  extractMax(): HeapNode | null
  /*
   * Gets the number of nodes in the heap.
   */
  size(): number
  /*
   * sets the heap back  to an empty heap.
   */
  clear(): void
}

class MaxHeap implements HeapProps {
  private heap: Array<HeapNode> = []
  private heapSize = 0

  size = () => this.heapSize

  private swap = (i: number, j: number) => {
    const temp = this.heap[i]
    this.heap[i] = this.heap[j]
    this.heap[j] = temp
  }

  leftIndex = (parent: number) => parent * 2 + 1

  rightIndex = (parent: number) => parent * 2 + 2

  parentIndex = (child: number) => Math.floor((child - 1) / 2)

  private maxChildIndex = (parent: number) => {
    const left = this.leftIndex(parent)
    const right = this.rightIndex(parent)
    if (left < this.heapSize && right < this.heapSize) {
      return this.heap[left].key > this.heap[right].key ? left : right
    } else if (right < this.heapSize) {
      return right
    } else if (left < this.heapSize) {
      return left
    }
    return null
  }

  max = () => {
    if (this.heapSize > 0) {
      return this.heap[0]
    }
    return null
  }

  private siftUp = (index: number) => {
    let parent = this.parentIndex(index)

    while (index > 0 && this.heap[parent].key < this.heap[index].key) {
      this.swap(index, parent)
      index = parent
      parent = this.parentIndex(index)
    }
  }

  private siftDown = (index: number) => {
    let maxChild = this.maxChildIndex(index)
    while (
      maxChild !== null &&
      this.heap[index].key < this.heap[maxChild].key
    ) {
      this.swap(index, maxChild)
      index = maxChild
      maxChild = this.maxChildIndex(index)
    }
  }

  insert = (k: number | string, v: object) => {
    const node: HeapNode = { key: k, value: v }
    this.heap.push(node)
    this.heapSize += 1
    this.siftUp(this.heap.length - 1)
  }

  extractMax = () => {
    if (this.heapSize > 0) {
      const m = this.max()
      this.heap[0] = this.heap[this.heapSize - 1]
      this.heap.pop()
      this.heapSize -= 1
      this.siftDown(0)
      return m
    }
    return null
  }

  clear = () => {
    this.heap = []
    this.heapSize = 0
  }
}

export default MaxHeap
