import _ from 'lodash'

export function parseUrlsList(listUrl) {
  const result = []
  const urls = listUrl.toLowerCase()
  //get urls from list

  const endOfLine = /[\r\n]/
  const regexpUrl = /http\S+/gim //start 'http' while not space
  const splitterOneTab = ' | '
  const dataList = listUrl.split(endOfLine)

  const parsedList = dataList.map(item => {
    if (~item.indexOf(splitterOneTab)) {
      const oneTabItem = item.split(splitterOneTab)
      return { url: oneTabItem[0], title: oneTabItem[1] }
    } else {
      const url = item.match(regexpUrl)
      if (url) {
        return { url: url[0], title: '' }
      } else {
        return { url: null, title: item }
      }
    }
  })

  if (parsedList.length > 0) {
    let resultIndex = 0
    result.push({
      title: `import tag -`,
      urls: []
    })
    parsedList.forEach(item => {
      const { url, title } = item
      if (url) {
        result[resultIndex].urls.push(item)
      } else {
        if (result[resultIndex].urls.length > 0) {
          result.push({
            title: `import tag - ${item.title}`,
            urls: []
          })
          resultIndex = resultIndex + 1
        } else {
          result[resultIndex].title = `import tag - ${item.title}`
        }
      }
    })
  }

  return result
}

export function reorderList(list, startIndex, endIndex) {
  const result = list //Array.from(list)
  const [removed] = result.splice(startIndex, 1)
  result.splice(endIndex, 0, removed)
  return result
}

function processCheckTagIds(list, tags) {
  for (let i = 0; i < list.length; i++) {
    const tag = tags[list[i].id]
    if (typeof tag === 'undefined') {
      const [removed] = list.splice(i, 1)
      i--
      continue
    }
    processCheckTagIds(list[i].sub_tags, tags)
  }
}

export function checkTagIds(list, tags) {
  let result = [...list]
  processCheckTagIds(result, tags)
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

export function searchTagInSubTags(tag_id, sub_tags) {
  for (let i = 0; i < sub_tags.length; i++) {
    if (sub_tags[i].id === tag_id) {
      return true
    } else {
      const finded = searchTagInSubTags(tag_id, sub_tags[i].sub_tags)
      if (finded) {
        return true
      }
    }
  }
}

export function reorderTagsList(list, source_id, target_id, create_sub_tag) {
  let result = [...list]
  const removed = removeTag(result, source_id)
  if (removed) {
    insertTag(result, target_id, removed, create_sub_tag)
  }
  return result
}

function changeCollapseTag(tag_id, sub_tags) {
  for (let i = 0; i < sub_tags.length; i++) {
    if (sub_tags[i].id === tag_id) {
      sub_tags[i].collapsed = !sub_tags[i].collapsed
      return true
    } else {
      const flag = changeCollapseTag(tag_id, sub_tags[i].sub_tags)
      if (flag) {
        return true
      }
    }
  }
}

export function collapseTag(list, tag_id) {
  let result = [...list]
  changeCollapseTag(tag_id, result)

  return result
}
