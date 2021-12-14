import { h, resolveComponent, toRaw, VNode } from "vue";
import { isFunction, isString, isObject, isArray } from "./index";

const Regs: string[] = [];

/**
 * 解析节点
 * @param {*} vnode
 * @param {{ scope, prop, children, _data }} options
 */
function parseNode(vnode: any, options: any): VNode {
	const { scope, prop, slots, children } = options || [];

	// 插槽模式渲染
	if (vnode.name.indexOf("slot-") == 0) {
		const rn = slots[vnode.name];

		if (rn) {
			return rn({ scope, ...options._data });
		} else {
			return <cl-error-message title={`组件渲染失败，未找到插槽：${vnode.name}`} />;
		}
	}

	// 是否全局注册
	let isReg: boolean = Regs.includes(vnode.name);

	// 实例模式下，先注册到全局，再分解组件渲染
	if (vnode.__file && !isReg) {
		// @ts-ignore
		window.__crud_app__.component(vnode.name, vnode);
		isReg = true;
		Regs.push(vnode.name);
	}

	// 处理 props
	if (isFunction(vnode.props)) {
		vnode.props = vnode.props({ scope, ...options._data });
	}

	// 组件参数
	const props = {
		...vnode.props,
		...vnode,
		...vnode.attrs,
		scope
	};

	// 添加双向绑定
	if (props && scope) {
		props.modelValue = scope[prop];
		props["onUpdate:modelValue"] = function (val: any) {
			scope[prop] = val;
		};
	}

	// 组件实例渲染
	if (props.render && !isReg) {
		return h(props, props);
	}

	// 渲染组件
	const el: any = toRaw(resolveComponent(vnode.name));

	return h(el, props, {
		default: () => {
			return children;
		}
	});
}

/**
 * 渲染节点
 * @param {*} vnode
 * @param {*} options
 */
export function renderNode(vnode: any, { prop, scope, slots, _data }: any): VNode | any {
	if (!vnode) {
		return null;
	}

	if (vnode.__v_isVNode) {
		return vnode;
	}

	// 组件名渲染
	if (isString(vnode)) {
		return parseNode({ name: vnode }, { scope, slots });
	}

	// 方法回调
	if (isFunction(vnode)) {
		return vnode({ scope, h, ..._data });
	}

	// jsx 模式
	if (isObject(vnode)) {
		if (vnode.name) {
			// 扩展组件
			const keys: string[] = ["el-select", "el-radio-group", "el-checkbox-group"];

			if (keys.includes(vnode.name)) {
				let list: any[] = [];

				if (isFunction(vnode.options)) {
					list = vnode.options({ scope, ..._data });
				}

				if (isArray(vnode.options)) {
					list = vnode.options;
				}

				// 设置内容
				const children = (
					<div>
						{list.map((e: any, i: number) => {
							// 下拉框
							if (vnode.name == "el-select") {
								let label: any, value: any;

								if (isString(e)) {
									label = value = e;
								} else if (isObject(e)) {
									label = e.label;
									value = e.value;
								} else {
									return (
										<cl-error-message
											title={`组件渲染失败，options 参数错误`}
										/>
									);
								}

								return (
									<el-option key={i} label={label} value={value} {...e.props} />
								);
							}
							// 单选框组
							else if (vnode.name == "el-radio-group") {
								return h(<el-radio key={i} label={e.value}></el-radio>, e.props, {
									default() {
										return <span>{e.label}</span>;
									}
								});
							}
							// 多选框组
							else if (vnode.name == "el-checkbox-group") {
								return (
									<el-checkbox key={i} label={e.value} {...e.props}>
										{e.label}
									</el-checkbox>
								);
							} else {
								return null;
							}
						})}
					</div>
				);

				return parseNode(vnode, { prop, scope, _data, children });
			} else {
				return parseNode(vnode, { prop, scope, slots, _data });
			}
		} else {
			return <cl-error-message title={`组件渲染失败，组件 name 不能为空`} />;
		}
	}
}
