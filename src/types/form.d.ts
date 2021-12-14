import { FormHook } from "./hook";
import { RenderOptions } from "./render";

export declare interface FormItem {
	type?: "tabs" | string;
	prop?: string;
	props?: {
		labels?: Array<{ label: string; value: string; name?: string }>;
		justify?: "left" | "center" | "right";
		color?: string;
		mergeProp?: boolean;
		labelWidth?: string;
		error?: string;
		showMessage?: boolean;
		inlineMessage?: boolean;
		size?: "medium" | "small" | "mini";
		[key: string]: any;
	};
	hook?: FormHook;
	group?: string;
	collapse?: boolean;
	value?: any;
	label?: string | { text?: string; icon?: string; tip?: string };
	span?: number;
	flex?: boolean;
	hidden?: Function | boolean | string;
	prepend?: RenderOptions;
	component?: RenderOptions;
	append?: RenderOptions;
	rules?: any;
}

declare interface FormOpenEvent {
	close(): void;
	submit(): void;
	done(): void;
}

declare interface FormSubmitEvent {
	done(): void;
	close(): void;
}

export declare interface Form {
	title?: string;
	width?: string;
	props?: any;
	items: Array<FormItem>;
	form?: any;
	on?: {
		open?(form: any, event: FormOpenEvent): void;
		close?(done: Function): void;
		submit?(data: any, event: FormSubmitEvent): void;
	};
	op?: {
		hidden?: boolean;
		saveButtonText?: string;
		closeButtonText?: string;
		buttons?: Array<"close" | "save" | string>;
	};
	dialog?: {
		title?: string;
		width?: string;
		props?: any;
		hiddenControls?: boolean;
		controls?: Array<"fullscreen" | "close">;
	};
	isReset?: boolean;
	_data?: any;
}

export declare interface FormRef {
	create(options: Form): FormRef;
	open(options: Form): FormRef;
	close(): void;
	done(): void;
	clear(): void;
	showLoading(): void;
	hiddenLoading(): void;
	setData(): void;
	setOptions(prop: string, list: Array<{ label: string; value?: any }>): void;
	setProps(prop: string, value: any): void;
	getForm(prop?: string): any;
	setForm(prop: string, value: any): void;
	toggleItem(prop: string, flag?: boolean): void;
	hiddenItem(props: string[]): void;
	showItem(props: string[]): void;
	resetFields(): void;
	clearValidate(props: string[] | string): void;
	validateField(props: string[] | string, callback: Function): void;
	validate(callback: Function): void;
	changeTab(value: any, isValid?: boolean): Promise<any>;
	setTitle(value: string): void;
}
