const server = `http://47.100.219.10:7001`
const api =  {
  message: `/api/justwink/message_board`,
  comment: `/api/justwink/comment`,
}

export default Object.keys(api).reduce((_, k) => ({..._, [k]: `${server}${api[k]}`}), {})