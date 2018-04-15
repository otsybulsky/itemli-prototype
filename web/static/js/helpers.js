export function reorderList(list, startIndex, endIndex) {
  const result = list //Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

function removeTag(list, id) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === id) {
      const [removed] = list.splice(i, 1)
      return { removed, i }
    } else {
      const removed = removeTag(list[i].sub_tags, id)
      if (removed) {
        return removed
      }
    }
  }
}

function insertTag(list, target_id, buf_tag, create_sub_tag) {
  for (let i = 0; i < list.length; i++) {
    if (list[i].id === target_id) {
      if (create_sub_tag) {
        list[i].sub_tags.splice(0, 0, buf_tag.removed)
      } else {
        const ind = i >= buf_tag.i ? i + 1 : i
        list.splice(ind, 0, buf_tag.removed)
      }
      return true
    } else {
      const isInsert = insertTag(
        list[i].sub_tags,
        target_id,
        buf_tag,
        create_sub_tag
      )
      if (isInsert) {
        return isInsert
      }
    }
  }
}

export function reorderTagsList(list, source_id, target_id, create_sub_tag) {
  let result = list
  const removed = removeTag(result, source_id)
  if (removed) {
    insertTag(result, target_id, removed, create_sub_tag)
  }
  return result
}
